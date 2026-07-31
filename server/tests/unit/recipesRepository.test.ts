import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import type { NewRecipe, RecipeWithProfile } from "../../types/recipe.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../config/database.js", () => ({
  pool: {
    query: mockQuery,
  },
}));

const getAllRecipesQuery = `SELECT
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
    ORDER BY recipes.created_at DESC`;

const { getAllRecipes } = await import(
  "../../repositories/recipesRepository.js"
);

describe("getAllRecipes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns all recipes from the database", async () => {
    const mockRows: RecipeWithProfile[] = [
      {
        id: 1,
        title: "Pancakes",
        ingredients: [
          { name: "Flour", quantity: 2, unit: "cups" },
          { name: "Milk", quantity: 1.5, unit: "cups" },
        ],
        instructions: "Mix and cook on a griddle.",
        image: "pancakes.jpg",
        username: "chefuser",
        profile_image: "chefuser.jpg",
        category: [],
        created_at: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "Waffles",
        ingredients: [
          { name: "Flour", quantity: 2, unit: "cups" },
          { name: "Eggs", quantity: 2, unit: "whole" },
        ],
        instructions: "Mix and cook in a waffle iron.",
        image: "waffles.jpg",
        username: "chefuser",
        profile_image: "chefuser.jpg",
        category: [],
        created_at: "2024-01-02T00:00:00.000Z",
      },
    ];

    mockQuery.mockResolvedValue({ rows: mockRows });

    const result = await getAllRecipes();

    expect(mockQuery).toHaveBeenCalledWith(getAllRecipesQuery);
    expect(result).toEqual(mockRows);
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(getAllRecipes()).rejects.toThrow("DB connection failed");
  });

  it("returns an empty array when there are no recipes", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getAllRecipes();

    expect(mockQuery).toHaveBeenCalledWith(getAllRecipesQuery);
    expect(result).toEqual([]);
  });
});

const getRecipeByIdQuery = `SELECT
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
    GROUP BY recipes.id, users.username, users.profile_image`;

const { getRecipeById } = await import(
  "../../repositories/recipesRepository.js"
);

describe("getRecipeById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a recipe by ID from the database", async () => {
    const mockRecipe: RecipeWithProfile = {
      id: 1,
      title: "Pancakes",
      ingredients: [
        { name: "Flour", quantity: 2, unit: "cups" },
        { name: "Milk", quantity: 1.5, unit: "cups" },
      ],
      instructions: "Mix and cook on a griddle.",
      image: "pancakes.jpg",
      username: "chefuser",
      profile_image: "chefuser.jpg",
      category: [],
      created_at: "2024-01-01T00:00:00.000Z",
    };

    mockQuery.mockResolvedValue({ rows: [mockRecipe] });

    const result = await getRecipeById(1);

    expect(mockQuery).toHaveBeenCalledWith(getRecipeByIdQuery, [1]);
    expect(result).toEqual(mockRecipe);
  });

  it("returns undefined when the recipe does not exist", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getRecipeById(999);

    expect(mockQuery).toHaveBeenCalledWith(getRecipeByIdQuery, [999]);
    expect(result).toBeUndefined();
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(getRecipeById(1)).rejects.toThrow("DB connection failed");
  });
});

const insertRecipeQuery = `
    INSERT INTO recipes (title, ingredients, instructions, image, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

const insertCategoryQuery = `INSERT INTO recipes_categories (recipe_id, category_id) VALUES ($1, $2)`;

const { createRecipe } = await import(
  "../../repositories/recipesRepository.js"
);

describe("createRecipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const newRecipe: NewRecipe = {
    title: "Pancakes",
    ingredients: [{ name: "Flour", quantity: 2, unit: "cups" }],
    instructions: "Mix and cook on a griddle.",
    image: "pancakes.jpg",
    user_id: 1,
  };

  const mockCreatedRecipe: RecipeWithProfile = {
    id: 10,
    title: "Pancakes",
    ingredients: [{ name: "Flour", quantity: 2, unit: "cups" }],
    instructions: "Mix and cook on a griddle.",
    image: "pancakes.jpg",
    username: "chefuser",
    profile_image: "chefuser.jpg",
    category: ["Breakfast", "Quick"],
    created_at: "2024-01-01T00:00:00.000Z",
  };

  it("creates a recipe, links categories, and returns the full recipe", async () => {
    const categoryIDs = [3, 5];

    mockQuery
      // 1. insert into recipes
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      // 2. insert into recipes_categories (one per category)
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      // 3. getRecipeById internally calls pool.query
      .mockResolvedValueOnce({ rows: [mockCreatedRecipe] });

    const result = await createRecipe(newRecipe, categoryIDs);

    expect(mockQuery).toHaveBeenNthCalledWith(1, insertRecipeQuery, [
      newRecipe.title,
      newRecipe.ingredients,
      newRecipe.instructions,
      newRecipe.image,
      newRecipe.user_id,
    ]);
    expect(mockQuery).toHaveBeenNthCalledWith(2, insertCategoryQuery, [10, 3]);
    expect(mockQuery).toHaveBeenNthCalledWith(3, insertCategoryQuery, [10, 5]);
    expect(mockQuery).toHaveBeenCalledTimes(4);
    expect(result).toEqual(mockCreatedRecipe);
  });

  it("creates a recipe with no categories", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockResolvedValueOnce({ rows: [mockCreatedRecipe] });

    const result = await createRecipe(newRecipe, []);

    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockCreatedRecipe);
  });

  it("propagates an error if the recipe insert fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB connection failed"));

    await expect(createRecipe(newRecipe, [3])).rejects.toThrow(
      "DB connection failed",
    );
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("propagates an error if a category insert fails", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })
      .mockRejectedValueOnce(new Error("Invalid category ID"));

    await expect(createRecipe(newRecipe, [3])).rejects.toThrow(
      "Invalid category ID",
    );
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });
});

const deleteRecipeByIdQuery =
  "DELETE FROM recipes WHERE id = $1 AND user_id = $2";

const { deleteRecipeById } = await import(
  "../../repositories/recipesRepository.js"
);

describe("deleteRecipeById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when a recipe is deleted", async () => {
    mockQuery.mockResolvedValue({ rowCount: 1 });

    const result = await deleteRecipeById(1, 123);

    expect(mockQuery).toHaveBeenCalledWith(deleteRecipeByIdQuery, [1, 123]);
    expect(result).toBe(true);
  });

  it("returns false when no recipe matches the ID", async () => {
    mockQuery.mockResolvedValue({ rowCount: 0 });

    const result = await deleteRecipeById(999, 123);

    expect(mockQuery).toHaveBeenCalledWith(deleteRecipeByIdQuery, [999, 123]);
    expect(result).toBe(false);
  });

  it("returns false when rowCount is null", async () => {
    mockQuery.mockResolvedValue({ rowCount: null });

    const result = await deleteRecipeById(1, 123);

    expect(result).toBe(false);
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(deleteRecipeById(1, 123)).rejects.toThrow(
      "DB connection failed",
    );
  });
});

const mockDeleteRecipeById =
  jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../repositories/recipesRepository.js", () => ({
  deleteRecipeById: mockDeleteRecipeById,
}));

const { deleteRecipe } = await import("../../controllers/recipesController.js");

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response["status"];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response["json"];
  return res;
};

describe("deleteRecipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and a success message when the recipe is deleted", async () => {
    mockDeleteRecipeById.mockResolvedValue(true);
    const req = {
      params: { id: "1" },
      user: { id: 123 },
    } as unknown as Request<{ id: string }>;
    const res = mockResponse();

    await deleteRecipe(req, res);

    expect(mockDeleteRecipeById).toHaveBeenCalledWith(1, 123);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Recipe deleted successfully: 1",
    });
  });

  it("returns 400 when the ID is invalid", async () => {
    const req = {
      params: { id: "abc" },
      user: { id: 123 },
    } as unknown as Request<{ id: string }>;
    const res = mockResponse();

    await deleteRecipe(req, res);

    expect(mockDeleteRecipeById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid recipe ID" });
  });

  it("returns 404 when the recipe does not exist", async () => {
    mockDeleteRecipeById.mockResolvedValue(false);
    const req = {
      params: { id: "999" },
      user: { id: 123 },
    } as unknown as Request<{ id: string }>;
    const res = mockResponse();

    await deleteRecipe(req, res);

    expect(mockDeleteRecipeById).toHaveBeenCalledWith(999, 123);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Recipe not found: 999" });
  });

  it("returns 500 when the repository throws an error", async () => {
    mockDeleteRecipeById.mockRejectedValue(new Error("DB connection failed"));
    const req = {
      params: { id: "1" },
      user: { id: 123 },
    } as unknown as Request<{ id: string }>;
    const res = mockResponse();

    await deleteRecipe(req, res);

    expect(mockDeleteRecipeById).toHaveBeenCalledWith(1, 123);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to delete recipe: 1",
    });
  });
});
