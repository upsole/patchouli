import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import nextConnect from "next-connect";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, spacesConfig } from "../../../server/s3Client";
import { prisma } from "../../../server/db";
import { getSession } from "next-auth/react";

const { $bucket } = spacesConfig;

interface NextRequest extends NextApiRequest {
  file: any;
}

const handler = nextConnect<NextRequest, NextApiResponse>({
  onError(err, req, res) {
    console.log(err);
    res.status(500).json({ error: "Route Error", stack: err });
  },
  onNoMatch(_, res) {
    res.status(405).json({ error: "Method not allowed" });
  },
});

// TODO VALIDATE ENTRY BELONG TO USER
handler.get(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    const { id } = req.query;
    const entryExists = await prisma.entry.findUnique({
      where: { id: id as string },
    });
    if (entryExists) {
      const bucketParams = {
        Bucket: $bucket,
        Key: entryExists.file_key as string,
      };
      const signedUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand(bucketParams),
        { expiresIn: 15 * 60 }
      );
      res.status(200).json({ url: signedUrl, entryExists });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  }
  res.end();
});

// TODO SENDS DELETE REQ TO ASSOCIATED RESOURCE
handler.delete(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    const { id } = req.query;
    const entryExists = await prisma.entry.findUnique({
      where: { id: id as string },
    });
    if (!entryExists) {
      res.status(410).json({ error: "Not found" });
      res.end();
    } else {
      await prisma.entry.delete({ where: { id: id as string } });
      res.status(200).json({ message: `Entry ${entryExists!.id} deleted!` });
    }
  }
  res.end();
});

export default handler;
