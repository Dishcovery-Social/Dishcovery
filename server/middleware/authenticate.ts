import type { NextFunction, Request, Response } from "express";

export const authenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (request.isAuthenticated()) {
    next();
    return;
  }
  response.status(401).json({ error: "Unauthorized" });
};
