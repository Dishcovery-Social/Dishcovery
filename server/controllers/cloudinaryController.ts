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
    .upload_stream({ folder: "RecipeImages" }, (error, result) => {
      if (error) {
        response
          .status(400)
          .json({ error: `Could not upload file to cloudinary: ${error}` });
      } else {
        response.status(200).json(result);
      }
    })
    .end(buffer);
};
