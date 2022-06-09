-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "img_url" TEXT,
    "file_url" TEXT,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);
