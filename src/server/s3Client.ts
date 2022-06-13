import { S3 } from "@aws-sdk/client-s3";

export const spacesConfig = {
  $endpoint: process.env.SPACES_ENDPOINT,
  $credentials: {
    accessKeyId: process.env.SPACES_KEY as string,
    secretAccessKey: process.env.SPACES_SECRET as string,
  },
  $bucket: process.env.SPACES_BUCKET_NAME,
};

const s3Client = new S3({
  endpoint: spacesConfig.$endpoint,
  region: "eu-west-1", //region could be anything for DigitalOcean, its only to trick the S3client into sending compatible payload
  credentials: {
    accessKeyId: process.env.SPACES_KEY as string,
    secretAccessKey: process.env.SPACES_SECRET as string,
  },
});

export { s3Client };
