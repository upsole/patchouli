import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";
import nextConnect from "next-connect";
import { s3Client, spacesConfig } from "../../../server/s3Client";
import { prisma } from "../../../server/db";
import { v4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

interface NextRequest extends NextApiRequest {
  file: any;
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

const uploadMiddleware = upload.single("document");
handler.use(uploadMiddleware);

handler.post(async (req, res) => {
  const extension = path.extname(req.file.originalname);
  const id = v4();
  const bucketParams = {
    Bucket: $bucket,
    Key: id + extension,
    Body: req.file.buffer,
  };
  const s3Res = await s3Client.send(new PutObjectCommand(bucketParams));
  const newEntry = await prisma.entry.create({
    data: {
      id: id,
      tag: req.body.tag,
      text: req.body.text,
      file_key: bucketParams.Key,
    },
  });
  res.status(200).json({ entry: newEntry, metadata: s3Res });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};