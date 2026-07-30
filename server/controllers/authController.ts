import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { env } from "../config/env.js";

export const initiateGitHubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export const handleGitHubCallback = passport.authenticate("github", {
  successRedirect: `${env.CLIENT_URL}?login=success`,
  failureRedirect: `${env.CLIENT_URL}?login=failed`,
});

export const getCurrentUser = (request: Request, response: Response): void => {
  const { id, username, profile_image } = request.user!;
  response.status(200).json({ id, username, profile_image });
};

export const handleLogout = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  request.logout((logoutError) => {
    if (logoutError) return next(logoutError);
    request.session.destroy((sessionError) => {
      if (sessionError) return next(sessionError);
      response.clearCookie("connect.sid");
      response.sendStatus(204);
    });
  });
};
