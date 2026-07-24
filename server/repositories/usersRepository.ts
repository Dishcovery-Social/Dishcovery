import { pool } from "../config/database.js";
import type { User } from "../types/user.js";

export const getUserByGitHubId = async (id: bigint): Promise<User> => {
  const results = await pool.query<User>(
    "SELECT * FROM users WHERE github_id = $1",
    [id],
  );
  return results.rows[0];
};
