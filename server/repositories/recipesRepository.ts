import { pool } from "../config/database.js";
import type { Recipe } from "../types/recipe.js";

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const results = await pool.query<Recipe>(
    "SELECT * FROM recipes ORDER BY id ASC",
  );
  return results.rows;
};
