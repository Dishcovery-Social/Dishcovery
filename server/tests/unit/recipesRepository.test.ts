import { afterEach, describe, expect, it, jest } from "@jest/globals";

const mockQuery = jest.fn();

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
    const mockRows = [
      { id: 1, name: "Pancakes" },
      { id: 2, name: "Waffles" },
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
});
