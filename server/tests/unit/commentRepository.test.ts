import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { CommentWithProfile } from "../../types/comments.js";

const mockQuery = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../../config/database.js", () => ({
  pool: {
    query: mockQuery,
  },
}));

const getAllCommentsQuery = `SELECT
      comments.id,
      comments.body,
      comments.recipe_id,
      comments.created_at,
      users.username,
      users.profile_image
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.recipe_id = $1
    ORDER BY comments.created_at ASC`;

const { getAllCommentsForRecipe } = await import(
  "../../repositories/commentsRepository.js"
);

describe("getAllCommentsForRecipe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns all comments from the database", async () => {
    const mockRows: CommentWithProfile[] = [
      {
        id: 1,
        body: "Great recipe!",
        recipe_id: 1,
        created_at: "2024-01-01T00:00:00.000Z",
        username: "testuser",
        profile_image: "testuser.jpg",
      },
      {
        id: 2,
        body: "I love this!",
        recipe_id: 1,
        created_at: "2024-01-02T00:00:00.000Z",
        username: "testuser",
        profile_image: "testuser.jpg",
      },
    ];

    mockQuery.mockResolvedValue({ rows: mockRows });

    const result = await getAllCommentsForRecipe(1);

    expect(mockQuery).toHaveBeenCalledWith(getAllCommentsQuery, [1]);
    expect(result).toEqual(mockRows);
  });

  it("propagates an error if the query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(getAllCommentsForRecipe(1)).rejects.toThrow(
      "DB connection failed",
    );
  });

  it("returns an empty array when there are no recipes", async () => {
    mockQuery.mockResolvedValue({ rows: [] });

    const result = await getAllCommentsForRecipe(1);

    expect(mockQuery).toHaveBeenCalledWith(getAllCommentsQuery, [1]);
    expect(result).toEqual([]);
  });
});
