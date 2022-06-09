import type { NextApiRequest, NextApiResponse } from 'next'
import path from "path";
import nextConnect from "next-connect";
import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (_, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!") as any, false);
      return;
    }
    cb(null, true);
  },
});

const handler = nextConnect({
  // onNoMatch: (req, res) => { res.status(404).end("Not Found") }
  onNoMatch(_, res: NextApiResponse) {
    res.status(405).json({ error: "Ay Lmao Method not allowed" })
  }
})

// const uploadMiddleware = upload.array('theFiles')
const uploadMiddleware = upload.single("image");
handler.use(uploadMiddleware)
// handler.use(upload)

handler.get((_: NextApiRequest, res) => {
  res.status(200).json({ status: "success" })
})

handler.post((req: NextApiRequest, res) => {
  console.log(req);
  res.status(200).json({status: "ayoo"})
  // PRISMA CODU
})

export default handler;
