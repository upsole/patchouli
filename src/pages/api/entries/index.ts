import type { NextApiRequest, NextApiResponse } from "next";
import type { UploadApiResponse } from "cloudinary";
import multer from "multer";
import { __prod__ } from "~/lib/constants";
// import streamifier from "stream/promises"
import path from "path";
import nextConnect from "next-connect";
import { uploadImageStream } from "../../../server/cloudinaryClient";
// import applyRateLimit from "~/server/rateMiddleware";
import { s3Client, spacesConfig } from "../../../server/s3Client";
import { prisma } from "../../../server/db";
import { v4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "next-auth/react";
import { today, yesterday } from "~/lib/dates";


interface NextRequest extends NextApiRequest {
  files: any;
}

const { $bucket } = spacesConfig;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const handler = nextConnect<NextRequest, NextApiResponse>({
  onError(err, req, res) {
    __prod__ ? null : console.log(err);
    __prod__ ? null : console.log(req);
    res.status(500).json({ error: "Server Error" });
  },
  onNoMatch(_, res) {
    res.status(405).json({ error: "Method not allowed" });
  },
});

const uploadMiddleware = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);
handler.use(uploadMiddleware);
// handler.use(applyRateLimit)

// LIST ENTRIES FOR A GIVEN USER
// if skip & tae are present, slices the returned array in accordance
// if tag is present, filters by it and returns the whole array
// currently if both skip/take and tag are present, tag is ignored
handler.get(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    res.end();
    return;
  }

  const userExists = await prisma.user.findUnique({
    where: { email: session!.user?.email as string },
  });
  if (!userExists) {
    res.status(401).json({ error: "Unauthorized" });
    res.end();
  } else {
    if (req.query.skip && req.query.take) {
      const skip = Number(req.query.skip) || 0;
      const take = Number(req.query.take) || 10;
      const entries = await prisma.entry.findMany({
        skip: skip as number,
        take: take as number,
        where: { userId: userExists.id },
        orderBy: [{ updatedAt: "desc" }],
        include: { tags: true },
      });
      res.status(200).json(entries);
    } else if (req.query.tag) {
      const entries = await prisma.entry.findMany({
        where: {
          tags: { some: { name: req.query.tag as string } },
          userId: userExists.id,
        },
        orderBy: [{ updatedAt: "desc" }],
        include: { tags: true },
      });
      res.status(200).json(entries);
    } else {
      res.end();
    }
  }
  res.end();
});

// POST NEW ENTRY
handler.post(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else if (!req.body.title || !req.body.text || !req.body.tags) {
    res.status(400).json({ error: "Missing Fields" });
  } else {
    //Queries all entries of last 24h with a file attached
    const uploadsToday = await prisma.entry.findMany({
      where: {
        user: { email: session.user?.email },
        updatedAt: { lte: today(), gte: yesterday() },
        file_key: { not: null }
      },
    });
    if (uploadsToday.length > 9 && req.files.document) {
      res.status(403).json({error: "Surpassed the maximun number of uploads (10)"})
      res.end()
      return
    }

    const id = v4();
    if (req.files.document) {
      const extension = path.extname(req.files.document[0].originalname);
      const bucket_directory = __prod__ ? session.user?.name! + "/" + id + extension : "dev/" + session.user?.name! + "/" + id + extension;
      const bucketParams = {
        Bucket: $bucket,
        Key: bucket_directory,
        Body: req.files.document[0].buffer,
      };
      await s3Client.send(new PutObjectCommand(bucketParams));
      const cloudResponse = req.files.image
        ? ((await uploadImageStream(req.files.image[0].buffer).then(
          (i) => i
        )) as UploadApiResponse)
        : undefined;

      const formattedTags = req.body.tags.split(",").map((t: string) => {
        return { where: { name: t }, create: { name: t } };
      });
      const newEntry = await prisma.entry.create({
        data: {
          id: id,
          title: req.body.title,
          user: { connect: { email: session.user!.email as string } },
          tags: {
            connectOrCreate: formattedTags,
          },
          text: req.body.text,
          file_key: bucketParams.Key,
          img_url: cloudResponse?.secure_url
            ? cloudResponse.secure_url
            : undefined,
          img_id: cloudResponse?.public_id
            ? cloudResponse.public_id
            : undefined,
        },
      });
      res.status(201).json({ entry: newEntry });
    } else {
      const cloudResponse = req.files.image
        ? ((await uploadImageStream(req.files.image[0].buffer).then(
          (i) => i
        )) as UploadApiResponse)
        : undefined;
      const formattedTags = req.body.tags.split(",").map((t: string) => {
        return { where: { name: t }, create: { name: t } };
      });
      const newEntry = await prisma.entry.create({
        data: {
          id: id,
          title: req.body.title,
          user: { connect: { email: session.user!.email as string } },
          tags: {
            connectOrCreate: formattedTags,
          },
          text: req.body.text,
          img_url: cloudResponse?.secure_url
            ? cloudResponse.secure_url
            : undefined,
          img_id: cloudResponse?.public_id
            ? cloudResponse.public_id
            : undefined,
        },
      });
      res.status(200).json({ entry: newEntry });
    }
  }
  res.end();
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
