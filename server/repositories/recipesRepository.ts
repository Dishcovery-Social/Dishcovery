import { pool } from "../config/database.js";
import type { NewRecipe, Recipe, RecipeWithProfile } from "../types/recipe.js";

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

export const patchRecipeById = async (
  id: number,
  recipe: Partial<Recipe>,
): Promise<RecipeWithProfile | undefined> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const allowedFields = ["title", "ingredients", "instructions", "image"];

    const filteredFields = Object.keys(recipe).filter((field) =>
      allowedFields.includes(field),
    );

    if (filteredFields.length === 0 && !recipe.category) {
      throw new Error("No fields provided for update");
    }

    if (filteredFields.length > 0) {
      const values = filteredFields.map(
        (field) => recipe[field as keyof Recipe],
      );

      const setClause = filteredFields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");

      const query = `
        UPDATE recipes
        SET ${setClause}
        WHERE id = $${filteredFields.length + 1}
        RETURNING *
      `;

      await client.query<RecipeWithProfile>(query, [...values, id]);
    }

    if (recipe.category) {
      await client.query(
        "DELETE FROM recipes_categories WHERE recipe_id = $1",
        [id],
      );

      for (const category of recipe.category.map(
        (cat: string) =>
          cat.trim().charAt(0).toUpperCase() + cat.trim().slice(1),
      )) {
        const categoryResult = await client.query<{ id: number }>(
          "SELECT id FROM categories WHERE name = $1",
          [category],
        );

        let categoryId: number;

        if (categoryResult.rows.length > 0) {
          categoryId = categoryResult.rows[0].id;
        } else {
          const insertCategoryResult = await client.query<{ id: number }>(
            "INSERT INTO categories (name) VALUES ($1) RETURNING id",
            [category],
          );

          categoryId = insertCategoryResult.rows[0].id;
        }

        await client.query(
          `
          INSERT INTO recipes_categories (recipe_id, category_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
          [id, categoryId],
        );
      }
    }

    const updatedResult = await client.query<RecipeWithProfile>(
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

    const updatedRecipe = updatedResult.rows[0];

    await client.query("COMMIT");

    return updatedRecipe;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
