import { pool } from "../config/database.js";
import type { User } from "../types/user.js";

type UserInsert = Omit<User, "id" | "created_at">;

export const getUserById = async (id: number): Promise<User | undefined> => {
  const results = await pool.query<User>("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  return results.rows[0];
};

export const getUserByGitHubId = async (
  github_id: bigint,
): Promise<User | undefined> => {
  const results = await pool.query<User>(
    "SELECT * FROM users WHERE github_id = $1",
    [github_id],
  );
  return results.rows[0];
};

export const createUser = async (user: UserInsert): Promise<User> => {
  const results = await pool.query<User>(
    `INSERT INTO users (github_id, username, email, profile_image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user.github_id, user.username, user.email, user.profile_image],
  );
  return results.rows[0];
};
