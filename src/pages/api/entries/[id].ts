import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import nextConnect from "next-connect";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, spacesConfig } from "../../../server/s3Client";
import { prisma } from "../../../server/db";

const {$bucket} = spacesConfig;

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
  const entryExists = await prisma.entry.findUnique({ where: { id: id as string } });
  if (entryExists) {
    const bucketParams = { Bucket: $bucket, Key: entryExists.file_key as string }
    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), {expiresIn: 15 * 60})
    res.status(200).json({url: signedUrl, entryExists})
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

export default handler;
