import { pool } from "../config/database.js";
import type { Recipe } from "../types/recipe.js";
import { camelizeKeys } from "./shared.js";

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const results = await pool.query(
    `SELECT
      recipes.*,
      COALESCE(array_agg(categories.name) FILTER (WHERE categories.name IS NOT NULL), '{}') AS category
    FROM recipes
    LEFT JOIN recipes_categories ON recipes.id = recipes_categories.recipe_id
    LEFT JOIN categories ON recipes_categories.category_id = categories.id
    GROUP BY recipes.id
    ORDER BY recipes.id ASC`,
  );
  return camelizeKeys<Recipe[]>(results.rows);
};

export const getRecipeById = async (id: number): Promise<Recipe | null> => {
  const result = await pool.query(
    `SELECT
      recipes.*,
      COALESCE(array_agg(categories.name) FILTER (WHERE categories.name IS NOT NULL), '{}') AS category
    FROM recipes
    LEFT JOIN recipes_categories ON recipes.id = recipes_categories.recipe_id
    LEFT JOIN categories ON recipes_categories.category_id = categories.id
    WHERE recipes.id = $1
    GROUP BY recipes.id
    `,
    [id],
  );
  return camelizeKeys<Recipe | null>(result.rows[0] ?? null);
};
