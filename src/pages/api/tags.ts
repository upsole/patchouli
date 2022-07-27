import { prisma } from "~/server/db";
import nextConnect from "next-connect";
import { logger } from "~/server/pino";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
// import tryp {Entry} from "@prisma/client";

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError(err, _, res) {
    logger.error(err);
    res.status(500).json({ error: "Server Error" });
  },
  onNoMatch(_, res) {
    res.status(405).json({ error: "Method not allowed" });
  },
});

const getSetOfTags = (arr: any[]) => {
  let set = new Set<string>();
  for (let i = 0; i < arr.length; i++) {
    for (let k in arr[i]!.tags) {
      set.add(arr[i]!.tags[k]!.name as string);
    }
  }
  //@ts-ignore Weird NextJS magic. Even tho es5 specified, iteration of set is possible
  return [...set];
};

handler.get(async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthenticated" });
    res.end();
    return;
  }
  const userExists = await prisma.user.findUnique({
    where: { email: session!.user!.email as string },
  });
  if (!userExists) {
    res.status(401).json({ error: "User not found" });
    res.end();
    return;
  }
  const entries = await prisma.entry.findMany({ where: { user: userExists }, include: {tags: true} });
  return res.status(200).json(getSetOfTags(entries))
});

export default handler;
