import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Recipe } from "../../types/recipe.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

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
    const mockRows: Recipe[] = [
      {
        id: 1,
        title: "Pancakes",
        ingredients: [
          { name: "Flour", quantity: "2", unit: "cups" },
          { name: "Milk", quantity: "1.5", unit: "cups" },
        ],
        instructions: "Mix and cook on a griddle.",
        image: "pancakes.jpg",
        user_id: 1,
      },
      {
        id: 2,
        title: "Waffles",
        ingredients: [
          { name: "Flour", quantity: "2", unit: "cups" },
          { name: "Eggs", quantity: "2", unit: "whole" },
        ],
        instructions: "Mix and cook in a waffle iron.",
        image: "waffles.jpg",
        user_id: 1,
      },
    ];

    mockQuery.mockResolvedValue({ rows: mockRows });

    const result = await getAllRecipes();

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM recipes ORDER BY id ASC",
    );
    expect(result).toEqual(mockRows);
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(getAllRecipes()).rejects.toThrow("DB connection failed");
  });

  it("returns an empty array when there are no recipes", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getAllRecipes();

    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM recipes ORDER BY id ASC",
    );
    expect(result).toEqual([]);
  });
});
