import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { RecipeWithProfile } from "../../types/recipe.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

const getAllRecipesQuery = `SELECT
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

jest.unstable_mockModule("../../config/database.js", () => ({
  pool: {
    query: mockQuery,
  },
}));

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

  it("returns null when the recipe does not exist", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getRecipeById(999);

    expect(mockQuery).toHaveBeenCalledWith(getRecipeByIdQuery, [999]);
    expect(result).toBeNull();
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(getRecipeById(1)).rejects.toThrow("DB connection failed");
  });
});
