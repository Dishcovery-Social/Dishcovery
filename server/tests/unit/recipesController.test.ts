import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

const mockGetRecipesByCategory =
  jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../repositories/recipesRepository.js", () => ({
  getAllRecipes: jest.fn(),
  getRecipeById: jest.fn(),
  createRecipe: jest.fn(),
  getRecipesByCategory: mockGetRecipesByCategory,
}));

jest.unstable_mockModule("../../repositories/categoriesRepository.js", () => ({
  findOrCreateCategoryIDs: jest.fn(),
}));

const { getRecipesByCategory } = await import(
  "../../controllers/recipesController.js"
);

const mockStatus = jest.fn();
const mockJson = jest.fn();

const mockResponse = {
  status: mockStatus.mockReturnValue({ json: mockJson }),
} as unknown as Response;

afterEach(() => {
  jest.clearAllMocks();
});

describe("getRecipesByCategory", () => {
  it("returns 200 with recipes for a valid category", async () => {
    const mockRecipes = [{ id: 1, title: "Pancakes", category: ["Breakfast"] }];
    const mockRequest = {
      params: { categoryName: "Breakfast" },
    } as unknown as Request;

    mockGetRecipesByCategory.mockResolvedValue(mockRecipes);

    await getRecipesByCategory(mockRequest, mockResponse);

    expect(mockGetRecipesByCategory).toHaveBeenCalledWith("Breakfast");
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockRecipes);
  });

  it("trims the category name before querying", async () => {
    const mockRequest = {
      params: { categoryName: "  Breakfast  " },
    } as unknown as Request;

    mockGetRecipesByCategory.mockResolvedValue([]);

    await getRecipesByCategory(mockRequest, mockResponse);

    expect(mockGetRecipesByCategory).toHaveBeenCalledWith("Breakfast");
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith([]);
  });

  it("returns 400 when the category name is missing", async () => {
    const mockRequest = {
      params: {},
    } as unknown as Request;

    await getRecipesByCategory(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Category name is required",
    });
    expect(mockGetRecipesByCategory).not.toHaveBeenCalled();
  });

  it("returns 400 when the category name is blank", async () => {
    const mockRequest = {
      params: { categoryName: "   " },
    } as unknown as Request;

    await getRecipesByCategory(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error:
        "Category name must be a non-empty string with a maximum length of 100 characters",
    });
    expect(mockGetRecipesByCategory).not.toHaveBeenCalled();
  });

  it("returns 400 when the category name is too long", async () => {
    const mockRequest = {
      params: { categoryName: "a".repeat(101) },
    } as unknown as Request;

    await getRecipesByCategory(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error:
        "Category name must be a non-empty string with a maximum length of 100 characters",
    });
    expect(mockGetRecipesByCategory).not.toHaveBeenCalled();
  });
});
