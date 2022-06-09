import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import NextConnect from "next-connect";

const upload = multer({
  storage: multer.diskStorage({}),
});
