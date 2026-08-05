import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";

type RequestWithFile = Request & {
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
};

const upload = async (request: RequestWithFile, response: Response) => {
  const file = request.file;
  if (!file) {
    response.status(400).json({ error: "No file uploaded" });
    return;
  }

  const buffer = file.buffer;

  cloudinary.uploader
    .upload_stream(
      {
        folder: "RecipeImages",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        max_bytes: 10 * 1024 * 1024,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          response
            .status(400)
            .json({ error: `Could not upload file to cloudinary}` });
        } else {
          response.status(200).json({
            public_id: result?.public_id,
            url: result?.secure_url,
          });
        }
      },
    )
    .end(buffer);
};

const deleteFile = async (request: Request, response: Response) => {
  const publicId = request.body.publicId;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    response.status(200).json(result);
  } catch (error) {
    response
      .status(409)
      .json({ error: `error deleting file with public_id: ${publicId}` });
  }
};

export { deleteFile, upload };
