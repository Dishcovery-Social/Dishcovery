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

const deleteCommentQuery = `DELETE FROM comments WHERE id = $1 AND user_id = $2`;

const { getAllCommentsForRecipe, deleteCommentById } = await import(
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
        created_at: new Date("2024-01-01T00:00:00.000Z"),
        username: "testuser",
        profile_image: "testuser.jpg",
      },
      {
        id: 2,
        body: "I love this!",
        recipe_id: 1,
        created_at: new Date("2024-01-02T00:00:00.000Z"),
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

describe("deleteCommentById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deletes the comment owned by the user", async () => {
    mockQuery.mockResolvedValue({ rowCount: 1 });

    await expect(deleteCommentById(5, 2)).resolves.toBeUndefined();

    expect(mockQuery).toHaveBeenCalledWith(deleteCommentQuery, [5, 2]);
  });

  it("throws when no comment is deleted", async () => {
    mockQuery.mockResolvedValue({ rowCount: 0 });

    await expect(deleteCommentById(5, 2)).rejects.toThrow(
      "Comment not deleted.",
    );

    expect(mockQuery).toHaveBeenCalledWith(deleteCommentQuery, [5, 2]);
  });

  it("propagates an error if the delete query fails", async () => {
    mockQuery.mockRejectedValue(new Error("DB connection failed"));

    await expect(deleteCommentById(5, 2)).rejects.toThrow(
      "DB connection failed",
    );
  });
});
