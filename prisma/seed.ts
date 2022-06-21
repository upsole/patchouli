import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  return
  // await prisma.post.create
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
