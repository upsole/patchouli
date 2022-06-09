import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path"
import nextConnect from "next-connect";
import { s3Client } from "../../../lib/s3Client";
import {prisma} from "../../../lib/db";
import {uuid} from "uuidv4";

interface NextRequest extends NextApiRequest {
  file: any;
}
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

const handler = nextConnect<NextRequest, NextApiResponse>({
  onError(err, req, res) {
    console.log(err);
    res.status(500).json({ error: "Route Error", stack: err })
  },
  onNoMatch(_, res) {
    res.status(405).json({ error: "Method not allowed" })
  }
})

const uploadMiddleware = upload.single("document")
handler.use(uploadMiddleware);

handler.post(async (req, res) => {
  const extension = path.extname(req.file.originalname);
  const id = uuid();
  // const bucketParams = { Bucket: "wrabbit", Key: req.file.originalname.replace(/ /g,"_").toLowerCase(), Body: req.file.buffer, acl: ""}
  const bucketParams = { Bucket: "wrabbit", Key: id+extension, Body: req.file.buffer, acl: "public-read"}
  const s3Res = await s3Client.upload(bucketParams).promise()
  const newEntry = await prisma.entry.create({data: {
    id: id, tag: req.body.tag, text: req.body.text, file_url: s3Res.Location
  }})
  res.status(200).json(newEntry)
})

export default handler;

export const config = {
  api: {
    bodyParser: false,
  }
}
