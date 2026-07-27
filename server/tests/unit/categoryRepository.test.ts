import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Category } from "../../types/category.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

const getAllCategoriesQuery = `SELECT * FROM categories`;

jest.unstable_mockModule("../../config/database.js", () => ({
  pool: {
    query: mockQuery,
  },
}));

const { getAllCategories } = await import(
  "../../repositories/categoriesRepository.js"
);

describe("getAllCategories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns all categories from the database", async () => {
    const mockRows: Category[] = [
      { id: 1, name: "Breakfast" },
      { id: 2, name: "Lunch" },
      { id: 3, name: "Dinner" },
    ];

    mockQuery.mockResolvedValue({ rows: mockRows });

    const result = await getAllCategories();

    expect(mockQuery).toHaveBeenCalledWith(getAllCategoriesQuery);
    expect(result).toEqual(mockRows);
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(getAllCategories()).rejects.toThrow("DB connection failed");
  });

  it("returns an empty array when there are no categories", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getAllCategories();

    expect(mockQuery).toHaveBeenCalledWith(getAllCategoriesQuery);
    expect(result).toEqual([]);
  });
});
