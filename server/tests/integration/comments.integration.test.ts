import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import request from "supertest";

const mockGetRecipeById = jest.fn<(recipeId: number) => Promise<unknown>>();
const mockGetAllCommentsForRecipe =
  jest.fn<(recipeId: number) => Promise<unknown>>();

const mockAuthenticate = jest.fn(
  (req: Request, _res: Response, next: NextFunction) => {
    req.user = { id: 1, username: "testuser" } as Request["user"];
    next();
  },
);

jest.unstable_mockModule("../../middleware/authenticate.js", () => ({
  authenticate: mockAuthenticate,
}));

jest.unstable_mockModule("../../repositories/recipesRepository.js", () => ({
  getRecipeById: mockGetRecipeById,
}));

jest.unstable_mockModule("../../repositories/commentsRepository.js", () => ({
  getAllCommentsForRecipe: mockGetAllCommentsForRecipe,
}));

const { default: commentsRouter } = await import("../../routes/comments.js");
const { buildTestApp } = await import("../testServer.js");
const app = buildTestApp("/recipes/:recipeId/comments", commentsRouter);

const mockComment = {
  id: 1,
  body: "Great recipe!",
  recipe_id: 1,
  created_at: "2024-01-01T00:00:00.000Z",
  username: "testuser",
  profile_image: "testuser.jpg",
};

describe("GET /recipes/1/comments", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with all comments for recipe 1", async () => {
    mockGetRecipeById.mockResolvedValue({ username: "testuser" });
    mockGetAllCommentsForRecipe.mockResolvedValue([mockComment]);

    const response = await request(app).get("/recipes/1/comments");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockComment]);
  });

  it("returns 200 with an empty array when there are no comments for the recipe", async () => {
    mockGetRecipeById.mockResolvedValue({ username: "testuser" });
    mockGetAllCommentsForRecipe.mockResolvedValue([]);

    const response = await request(app).get("/recipes/1/comments");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns 400 when the recipe ID is not a number", async () => {
    const response = await request(app).get("/recipes/abc/comments");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Recipe ID must be a number",
    });
  });

  it("returns 400 when the recipe ID is not positive", async () => {
    const response = await request(app).get("/recipes/0/comments");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Recipe ID must be a positive number",
    });
  });

  it("returns 404 when the recipe does not exist", async () => {
    mockGetRecipeById.mockResolvedValue(undefined);

    const response = await request(app).get("/recipes/999/comments");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Recipe not found: 999" });
  });

  it("returns 500 when the database query fails", async () => {
    mockGetRecipeById.mockResolvedValue({ username: "testuser" });
    mockGetAllCommentsForRecipe.mockRejectedValue(
      new Error("DB connection failed"),
    );

    const response = await request(app).get("/recipes/1/comments");

    expect(response.status).toBe(500);
  });
});
