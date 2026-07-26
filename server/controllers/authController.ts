import passport from "passport";

export const initiateGitHubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});
