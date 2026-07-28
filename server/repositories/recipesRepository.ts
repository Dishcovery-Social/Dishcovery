import { pool } from "../config/database.js";
import type { RecipeWithProfile } from "../types/recipe.js";

export const getAllRecipes = async (): Promise<RecipeWithProfile[]> => {
  const results = await pool.query<RecipeWithProfile>(
    `SELECT
      recipes.id,
      recipes.title,
      recipes.ingredients,
      recipes.instructions,
      recipes.image,
      recipes.created_at,
      users.username,
      users.profile_image,
      COALESCE(array_agg(categories.name) FILTER (WHERE categories.name IS NOT NULL), '{}') AS category
    FROM recipes
    LEFT JOIN recipes_categories ON recipes.id = recipes_categories.recipe_id
    LEFT JOIN categories ON recipes_categories.category_id = categories.id
    LEFT JOIN users ON recipes.user_id = users.id
    GROUP BY recipes.id, users.username, users.profile_image
    ORDER BY recipes.created_at DESC`,
  );
  return results.rows;
};

export const getRecipeById = async (
  id: number,
): Promise<RecipeWithProfile | undefined> => {
  const result = await pool.query<RecipeWithProfile>(
    `SELECT
      recipes.id,
      recipes.title,
      recipes.ingredients,
      recipes.instructions,
      recipes.image,
      recipes.created_at,
      users.username,
      users.profile_image,
      COALESCE(array_agg(categories.name) FILTER (WHERE categories.name IS NOT NULL), '{}') AS category
    FROM recipes
    LEFT JOIN recipes_categories ON recipes.id = recipes_categories.recipe_id
    LEFT JOIN categories ON recipes_categories.category_id = categories.id
    LEFT JOIN users ON recipes.user_id = users.id
    WHERE recipes.id = $1
    GROUP BY recipes.id, users.username, users.profile_image`,
    [id],
  );
  return result.rows[0];
};

export const deleteRecipeById = async (id: number): Promise<boolean> => {
  const deleted = await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
  return (deleted.rowCount ?? 0) > 0;
};
