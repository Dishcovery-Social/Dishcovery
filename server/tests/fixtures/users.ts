import type { User } from "../../types/user.js";

export const mockUser: User = {
  id: 1,
  github_id: "12345",
  username: "foodie",
  email: "foodie@example.com",
  profile_image: "https://avatars.githubusercontent.com/u/12345",
  created_at: new Date("2026-01-01"),
};
