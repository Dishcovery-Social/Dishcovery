import passport from "passport";
import { Strategy as GitHubStrategy, type Profile } from "passport-github2";
import * as UsersRepository from "../repositories/usersRepository.js";
import type { User } from "../types/user.js";
import { env } from "./env.js";

const verify = async (
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: (error: unknown, user?: User | false) => void,
) => {
  const { id, username, profileUrl, emails } = profile;
  try {
    const github_id = BigInt(id);
    const user = await UsersRepository.getUserByGitHubId(github_id);

    if (!user) {
      const newUser = await UsersRepository.createUser({
        github_id: github_id,
        username: username ?? `user_${id}`,
        email: emails?.[0]?.value ?? null,
        profile_image: profileUrl,
      });

      return done(null, newUser);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: `${env.SERVER_BASE_URL}/auth/github/callback`,
    },
    verify,
  ),
);
