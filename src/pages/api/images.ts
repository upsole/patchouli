import type { NextApiRequest, NextApiResponse } from 'next'
import {prisma} from "../../server/db";
import path from "path";
import nextConnect from "next-connect";
import multer from "multer";
import cloudinary from "cloudinary";

interface NextRequest extends NextApiRequest {
  file: any;
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// const prisma = new PrismaClient();
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (_, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".pdf") {
      cb(new Error("Unsupported file type!") as any, false);
      return;
    }
    cb(null, true);
  },
});
const handler = nextConnect<NextRequest, NextApiResponse>({
  // onNoMatch: (req, res) => { res.status(404).end("Not Found") }
  onError(err, req, res) {
    console.log(err);
    res.status(500).json({error: "Route Error", stack: err})
  },
  onNoMatch(_, res) {
    res.status(405).json({ error: "Method not allowed" })
  }
})

const uploadMiddleware = upload.single("image");
handler.use(uploadMiddleware)

handler.get((_: NextApiRequest, res) => {
  res.status(200).json({ status: "success" })
})

handler.post(async (req, res) => {
  console.log(req.file);
  const newPost = await prisma.entry.create({
    data: {
      text: req.body.text,
      tag: req.body.tag,
      img_url: req.file ? await cloudinary.v2.uploader.upload(req.file!.path).then((i) => i.secure_url) : undefined,
    }
  })
  res.status(200).json(newPost)
})

export default handler;

export const config = {
  api: {
    bodyParser: false,
  }
}
