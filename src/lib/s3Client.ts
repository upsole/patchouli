// import { S3 } from "@aws-sdk/client-s3";
import AWS from "aws-sdk";

// const s3Client = new S3({
//   endpoint: "https://ams3.digitaloceanspaces.com",
//   region: "eu-west-1", //region could be anything for DigitalOcean, its only to trick the S3client into sending compatible payload
//   credentials: {
//     accessKeyId: process.env.SPACES_KEY as string,
//     secretAccessKey: process.env.SPACES_SECRET as string
//   }
// })
const s3Client = new AWS.S3({
  endpoint: "https://ams3.digitaloceanspaces.com",
  region: "eu-west-1", //region could be anything for DigitalOcean, its only to trick the S3client into sending compatible payload
  credentials: {
    accessKeyId: process.env.SPACES_KEY as string,
    secretAccessKey: process.env.SPACES_SECRET as string
  }
})

export { s3Client };
