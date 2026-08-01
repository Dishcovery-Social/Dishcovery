import type { Request, Response } from "express";

export const notFound = (_request: Request, response: Response): void => {
  response.status(404).json({ error: "Not found" });
};
