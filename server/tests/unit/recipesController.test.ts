import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

const mockGetAllRecipes = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const mockGetRecipesByCategory =
  jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../repositories/recipesRepository.js", () => ({
  getAllRecipes: mockGetAllRecipes,
  getRecipeById: jest.fn(),
  createRecipe: jest.fn(),
  getRecipesByCategory: mockGetRecipesByCategory,
}));

jest.unstable_mockModule("../../repositories/categoriesRepository.js", () => ({
  findOrCreateCategoryIDs: jest.fn(),
}));

const { getAllRecipes } = await import(
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

describe("getAllRecipes (category query)", () => {
  it("calls getRecipesByCategory when query param is provided", async () => {
    const mockRecipes = [{ id: 1, title: "Pancakes", category: ["Breakfast"] }];
    const mockRequest = {
      query: { category: "Breakfast" },
    } as unknown as Request;

    mockGetRecipesByCategory.mockResolvedValue(mockRecipes);

    await getAllRecipes(mockRequest, mockResponse);

    expect(mockGetRecipesByCategory).toHaveBeenCalledWith("Breakfast");
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockRecipes);
  });

  it("trims the category query before querying", async () => {
    const mockRequest = {
      query: { category: "  Breakfast  " },
    } as unknown as Request;

    mockGetRecipesByCategory.mockResolvedValue([]);

    await getAllRecipes(mockRequest, mockResponse);

    expect(mockGetRecipesByCategory).toHaveBeenCalledWith("Breakfast");
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith([]);
  });

  it("calls getAllRecipes when no category is provided", async () => {
    const mockRequest = {
      query: {},
    } as unknown as Request;

    const mockRecipes = [{ id: 2, title: "Waffles", category: [] }];
    mockGetAllRecipes.mockResolvedValue(mockRecipes);

    await getAllRecipes(mockRequest, mockResponse);

    expect(mockGetAllRecipes).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockRecipes);
  });

  it("treats blank category as no filter and calls getAllRecipes", async () => {
    const mockRequest = {
      query: { category: "   " },
    } as unknown as Request;

    const mockRecipes = [{ id: 3, title: "Toast", category: [] }];
    mockGetAllRecipes.mockResolvedValue(mockRecipes);

    await getAllRecipes(mockRequest, mockResponse);

    expect(mockGetRecipesByCategory).not.toHaveBeenCalled();
    expect(mockGetAllRecipes).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockRecipes);
  });
});
