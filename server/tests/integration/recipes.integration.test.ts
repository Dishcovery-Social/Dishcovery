import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import request from "supertest";
import type { RecipeWithProfile } from "../../types/recipe.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../config/database.js", () => ({
  pool: {
    query: mockQuery,
  },
}));

const mockAuthenticate = jest.fn(
  (_req: Request, _res: Response, next: NextFunction) => next(),
);

jest.unstable_mockModule("../../middleware/authenticate.js", () => ({
  authenticate: mockAuthenticate,
}));

const mockFindOrCreateCategoryIDs =
  jest.fn<(...args: unknown[]) => Promise<number[]>>();

jest.unstable_mockModule("../../repositories/categoriesRepository.js", () => ({
  findOrCreateCategoryIDs: mockFindOrCreateCategoryIDs,
}));

const { default: recipesRouter } = await import("../../routes/recipes.js");
const { buildTestApp } = await import("../testServer.js");
const app = buildTestApp("/recipes", recipesRouter);

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

describe("GET /recipes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with all recipes", async () => {
    mockQuery.mockResolvedValue({ rows: [mockRecipe] });

    const response = await request(app).get("/recipes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockRecipe]);
  });

  it("returns 200 with an empty array when there are no recipes", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/recipes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns 500 when the database query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    const response = await request(app).get("/recipes");

    expect(response.status).toBe(500);
  });
});

describe("GET /recipes/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with the recipe when it exists", async () => {
    mockQuery.mockResolvedValue({ rows: [mockRecipe] });

    const response = await request(app).get("/recipes/1");

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [1]);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRecipe);
  });

  it("returns 404 when the recipe does not exist", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/recipes/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Recipe not found: 999" });
  });

  it("returns 400 when the id is not numeric", async () => {
    const response = await request(app).get("/recipes/abc");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid recipe ID" });
  });

  it("returns 500 when the database query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    const response = await request(app).get("/recipes/1");

    expect(response.status).toBe(500);
  });
});

describe("POST /recipes", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockAuthenticate.mockImplementation(
      (_req: Request, _res: Response, next: NextFunction) => next(),
    );
  });

  const newRecipe = {
    title: "Pancakes",
    ingredients: [{ name: "Flour", quantity: 2, unit: "cups" }],
    instructions: "Mix and cook on a griddle.",
    image: "pancakes.jpg",
    user_id: 1,
    category: ["Breakfast"],
  };

  it("returns 401 when the user is not authenticated", async () => {
    mockAuthenticate.mockImplementation((_req: Request, res: Response) =>
      res.status(401).json({ error: "Unauthorized" }),
    );

    const response = await request(app).post("/recipes").send(newRecipe);

    expect(response.status).toBe(401);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("returns 400 when a required field is missing", async () => {
    const { category, ...incompleteRecipe } = newRecipe;

    const response = await request(app).post("/recipes").send(incompleteRecipe);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "category is required" });
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("returns 201 with the created recipe when authenticated", async () => {
    mockFindOrCreateCategoryIDs.mockResolvedValue([1]);
    mockQuery.mockImplementation((query: unknown) => {
      const text = query as string;
      if (text.startsWith("INSERT INTO recipes ")) {
        return Promise.resolve({ rows: [{ id: 1 }] });
      }
      if (text.includes("INSERT INTO recipes_categories")) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [mockRecipe] });
    });

    const response = await request(app).post("/recipes").send(newRecipe);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockRecipe);
  });

  it("returns 500 when the database query fails", async () => {
    mockFindOrCreateCategoryIDs.mockResolvedValue([1]);
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    const response = await request(app).post("/recipes").send(newRecipe);

    expect(response.status).toBe(500);
  });
});
