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

export const getCommentById = async (
  commentId: number,
): Promise<CommentWithProfile | undefined> => {
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
    WHERE comments.id = $1`,
    [commentId],
  );

  return results.rows[0];
};

export const createCommentForRecipe = async (
  recipeId: number,
  userId: number,
  body: string,
): Promise<CommentWithProfile> => {
  const results = await pool.query<{ id: number }>(
    `INSERT INTO comments (recipe_id, user_id, body)
    VALUES ($1, $2, $3)
    RETURNING id`,
    [recipeId, userId, body],
  );

  const createdComment = await getCommentById(results.rows[0].id);
  if (!createdComment) {
    throw new Error("Failed to retrieve the newly created comment");
  }

  return createdComment;
};

export const deleteCommentById = async (
  commentId: number,
  userId: number,
): Promise<void> => {
  const deleted = await pool.query(
    `DELETE FROM comments WHERE id = $1 AND user_id = $2`,
    [commentId, userId],
  );
  if (deleted.rowCount === 0) {
    throw new Error("Comment not deleted.");
  }
};
