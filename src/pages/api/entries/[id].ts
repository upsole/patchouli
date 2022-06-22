import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import nextConnect from "next-connect";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, spacesConfig } from "../../../server/s3Client";
import { cloudinary } from "../../../server/cloudinaryClient";
import { prisma } from "../../../server/db";
import { getSession } from "next-auth/react";

const { $bucket } = spacesConfig;

interface NextRequest extends NextApiRequest {
  file: any;
}

const handler = nextConnect<NextRequest, NextApiResponse>({
  onError(err, req, res) {
    res.status(500).json({ error: "Server Error" });
  },
  onNoMatch(_, res) {
    res.status(405).json({ error: "Method not allowed" });
  },
});

// TODO Separate logic for signed url & detail get
// GENERATES SIGNED URL AND RETURNS ENTRY DETAILS
handler.get(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    const { id } = req.query;
    const entryExists = await prisma.entry.findUnique({
      where: { id: id as string },
    });
    const userExists = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });
    if (entryExists && userExists && entryExists.userId === userExists.id) {
      const bucketParams = {
        Bucket: $bucket,
        Key: entryExists.file_key as string,
      };
      const signedUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand(bucketParams),
        { expiresIn: 5 * 60 }
      );
      res.status(200).json({ url: signedUrl });
    } else {
      if (!entryExists) {
        res.status(404).json({ error: "Not found" });
      } else if (!userExists || entryExists.userId === userExists.id) {
        res.status(403).json({ error: "Forbidden" });
      }
    }
  }
  res.end();
});

handler.delete(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    const { id } = req.query;
    const entryExists = await prisma.entry.findUnique({
      where: { id: id as string },
    });
    const userExists = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });
    if (entryExists && userExists && entryExists.userId === userExists.id) {
      if (entryExists.file_key) {
        const bucketParams = {
          Bucket: $bucket,
          Key: entryExists.file_key as string,
        };
        await s3Client.send(new DeleteObjectCommand(bucketParams))
      }
      if (entryExists.img_url) {
        await cloudinary.v2.uploader.destroy(entryExists.img_id as string)
      }
      await prisma.entry.delete({ where: { id: id as string } });
      res.status(200).json({ message: `Entry ${entryExists!.id} deleted!` });
    } else {
      if (!entryExists) {
        res.status(410).json({ error: "Not found" });
        res.end();
      }
    }
  }
  res.end();
});

export default handler;
