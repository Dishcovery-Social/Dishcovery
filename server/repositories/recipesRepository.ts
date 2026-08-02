import { pool } from "../config/database.js";
import type { NewRecipe, RecipeWithProfile } from "../types/recipe.js";

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

export const createRecipe = async (
  recipeData: NewRecipe,
  categoryIDs: number[],
): Promise<RecipeWithProfile> => {
  const instertRecipeQuery = `
    INSERT INTO recipes (title, ingredients, instructions, image, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  const recipeResult = await pool.query<{ id: number }>(instertRecipeQuery, [
    recipeData.title,
    recipeData.ingredients,
    recipeData.instructions,
    recipeData.image,
    recipeData.user_id,
  ]);

  const recipeId = recipeResult.rows[0].id;

  for (const categoryId of categoryIDs) {
    await pool.query(
      `INSERT INTO recipes_categories (recipe_id, category_id) VALUES ($1, $2)`,
      [recipeId, categoryId],
    );
  }

  const recipe = await getRecipeById(recipeId);
  if (!recipe) {
    throw new Error("Failed to retrieve the newly created recipe.");
  }

  return recipe;
};

export const deleteRecipeById = async (
  id: number,
  userId: number,
): Promise<boolean> => {
  const deleted = await pool.query(
    "DELETE FROM recipes WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  return (deleted.rowCount ?? 0) > 0;
};
