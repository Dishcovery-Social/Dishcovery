import { pool } from "../config/database.js";
import type { Recipe } from "../types/recipe.js";

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const results = await pool.query<Recipe>(
    `SELECT
      recipes.*,
      COALESCE(array_agg(categories.name) FILTER (WHERE categories.name IS NOT NULL), '{}') AS category
    FROM recipes
    LEFT JOIN recipes_categories ON recipes.id = recipes_categories.recipe_id
    LEFT JOIN categories ON recipes_categories.category_id = categories.id
    GROUP BY recipes.id
    ORDER BY recipes.id ASC`,
  );
  return results.rows;
};
