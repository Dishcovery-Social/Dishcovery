import { pool } from "../config/database.js";
import type { CommentWithProfile } from "../types/comments.js";

export const getAllCommentsForRecipe = async (
  recipeId: number,
): Promise<CommentWithProfile[]> => {
  const results = await pool.query<CommentWithProfile>(
    `SELECT
      comments.id,
      comments.body,
      comments.recipe_id,
      comments.created_at,
      users.username,
      users.profile_image
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.recipe_id = $1
    ORDER BY comments.created_at ASC`,
    [recipeId],
  );
  return results.rows;
};
