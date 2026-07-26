import passport from "passport";
import { env } from "../config/env.js";

export const initiateGitHubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export const handleGitHubCallback = passport.authenticate("github", {
  successRedirect: `${env.CLIENT_URL}?login=success`,
  failureRedirect: `${env.CLIENT_URL}?login=failed`,
});
