import cloudinary from "../config/cloudinary.js";
import type { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Uploads a buffer to Cloudinary using a stream.
 */
export const uploadImageToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned no result"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
};

/**
 * Deletes an image from Cloudinary by its public ID.
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
