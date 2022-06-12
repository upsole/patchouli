import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import nextConnect from "next-connect";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from "../../../lib/s3Client";
import { prisma } from "../../../lib/db";

interface NextRequest extends NextApiRequest {
  file: any;
}

const handler = nextConnect<NextRequest, NextApiResponse>({
  onError(err, req, res) {
    console.log(err);
    res.status(500).json({ error: "Route Error", stack: err })
  },
  onNoMatch(_, res) {
    res.status(405).json({ error: "Method not allowed" })
  }
})

handler.get(async (req, res) => {
  const { id } = req.query;
  const entryExists = await prisma.entry.findUnique({ where: { id: id } })
  if (entryExists) {
    const bucketParams = { Bucket: "wrabbit", Key: entryExists.file_url }
    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), {expiresIn: 15 * 60})
  } else { res.status(404).json({ error: "Not found" }) }
})
