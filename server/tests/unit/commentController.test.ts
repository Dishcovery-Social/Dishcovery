import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

const mockGetRecipeById = jest.fn<(recipeId: number) => Promise<unknown>>();
const mockGetAllCommentsForRecipe =
  jest.fn<(recipeId: number) => Promise<unknown>>();
const mockJson = jest.fn();
const mockStatus = jest.fn();

jest.unstable_mockModule("../../repositories/commentsRepository.js", () => ({
  getAllCommentsForRecipe: mockGetAllCommentsForRecipe,
}));

jest.unstable_mockModule("../../repositories/recipesRepository.js", () => ({
  getRecipeById: mockGetRecipeById,
}));

const { getAllCommentsForRecipe } = await import(
  "../../controllers/commentsController.js"
);

const mockRes = {
  status: mockStatus.mockReturnValue({ json: mockJson }),
} as unknown as Response;

const buildRequest = (overrides: Partial<Request> = {}) =>
  ({
    params: { recipeId: "1" },
    user: { id: 1, username: "owner" },
    ...overrides,
  }) as unknown as Request;

afterEach(() => {
  jest.clearAllMocks();
  mockStatus.mockReturnValue({ json: mockJson });
});

describe("getAllCommentsForRecipe", () => {
  it("returns 400 when the recipe ID is not a number", async () => {
    const req = buildRequest({ params: { recipeId: "abc" } });

    await getAllCommentsForRecipe(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Recipe ID must be a number",
    });
    expect(mockGetRecipeById).not.toHaveBeenCalled();
  });

  it("returns 400 when the recipe ID is not positive", async () => {
    const req = buildRequest({ params: { recipeId: "0" } });

    await getAllCommentsForRecipe(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Recipe ID must be a positive number",
    });
    expect(mockGetRecipeById).not.toHaveBeenCalled();
  });

  it("returns 404 when the recipe does not exist", async () => {
    mockGetRecipeById.mockResolvedValue(undefined);
    const req = buildRequest();

    await getAllCommentsForRecipe(req, mockRes);

    expect(mockGetRecipeById).toHaveBeenCalledWith(1);
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ error: "Recipe not found: 1" });
  });

  it("returns comments for the recipe when the recipe exists", async () => {
    const comments = [{ id: 1, body: "Great recipe!" }];
    mockGetRecipeById.mockResolvedValue({ username: "owner" });
    mockGetAllCommentsForRecipe.mockResolvedValue(comments);
    const req = buildRequest();

    await getAllCommentsForRecipe(req, mockRes);

    expect(mockGetRecipeById).toHaveBeenCalledWith(1);
    expect(mockGetAllCommentsForRecipe).toHaveBeenCalledWith(1);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(comments);
  });
});
