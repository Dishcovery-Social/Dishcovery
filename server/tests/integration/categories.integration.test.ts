import { afterEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import type { Category } from "../../types/category.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../config/database.js", () => ({
  pool: {
    query: mockQuery,
  },
}));

const { default: categoriesRouter } = await import(
  "../../routes/categories.js"
);
const { buildTestApp } = await import("../testServer.js");
const app = buildTestApp("/categories", categoriesRouter);

const mockCategory: Category = {
  id: 1,
  name: "Breakfast",
};

describe("GET /categories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with all categories", async () => {
    mockQuery.mockResolvedValue({ rows: [mockCategory] });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockCategory]);
  });

  it("returns 200 with an empty array when there are no categories", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns 500 when the database query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    const response = await request(app).get("/categories");

    expect(response.status).toBe(500);
  });
});
