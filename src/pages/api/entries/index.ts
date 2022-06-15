import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
// import streamifier from "stream/promises"
import path from "path";
import nextConnect from "next-connect";
import { uploadImageStream } from "../../../server/cloudinaryClient";
import { s3Client, spacesConfig } from "../../../server/s3Client";
import { prisma } from "../../../server/db";
import { v4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "next-auth/react";

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
    console.log(err);
    res.status(500).json({ error: "Route Error", stack: err });
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

// LIST ENTRIES FOR A GIVEN USER
handler.get(async (req, res) => {
  const session = await getSession({ req });
  const skip = req.query.skip || 0
  const take = req.query.take || 5
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    const userExists = await prisma.user.findUnique({
      where: { email: session!.user?.email as string },
    });
    if (!userExists) {
      res.status(401).json({ error: "Unauthorized" });
      res.end();
    } else {
      const entries = await prisma.entry.findMany({
        skip: skip as number,
        take: take as number,
        where: { userId: userExists.id },
      });
      res.status(200).json(entries)
    }
  }
  res.end();
});

// POST NEW ENTRY
handler.post(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    const id = v4();
    if (req.files.document) {
      const extension = path.extname(req.files.document[0].originalname);
      const bucketParams = {
        Bucket: $bucket,
        Key: id + extension,
        Body: req.files.document[0].buffer,
      };
      const s3Res = await s3Client.send(new PutObjectCommand(bucketParams));
      const newEntry = await prisma.entry.create({
        data: {
          id: id,
          user: { connect: { email: session.user!.email as string } },
          tags: req.body.tags ? req.body.tags : undefined,
          text: req.body.text,
          file_key: bucketParams.Key,
          img_url: req.files.image
            ? await uploadImageStream(req.files.image[0].buffer).then(
              (i: any) => i.secure_url
            )
            : undefined,
        },
      });
      res.status(200).json({ entry: newEntry, metadata: s3Res });
    } else {
      const newEntry = await prisma.entry.create({
        data: {
          id: id,
          user: { connect: { email: session.user!.email as string } },
          tags: req.body.tags,
          text: req.body.text,
          img_url: req.files.image
            ? await uploadImageStream(req.files.image[0].buffer).then(
              (i: any) => i.secure_url
            )
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
