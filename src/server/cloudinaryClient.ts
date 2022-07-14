import cloudinary from "cloudinary";
import streamifier from "streamifier";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export { cloudinary };
const streamImage = (fileBuffer: Buffer) => {
  /* Promisifies upload_stream */
  return new Promise((resolve, reject) => {
    let stream = cloudinary.v2.uploader.upload_stream({upload_preset: "nbirfdgh"}, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const uploadImageStream = async (fileBuffer: Buffer) => {
  /* wrapper that allows the result object to be accessed */
  const result = await streamImage(fileBuffer)
  return result
}
