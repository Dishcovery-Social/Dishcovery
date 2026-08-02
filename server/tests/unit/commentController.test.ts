import { afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

const mockGetRecipeById = jest.fn<(recipeId: number) => Promise<unknown>>();
const mockGetAllCommentsForRecipe =
  jest.fn<(recipeId: number) => Promise<unknown>>();
const mockCreateCommentForRecipe =
  jest.fn<
    (recipeId: number, userId: number, body: string) => Promise<unknown>
  >();
const mockGetCommentById = jest.fn<(commentId: number) => Promise<unknown>>();
const mockDeleteCommentById =
  jest.fn<(commentId: number, userId: number) => Promise<void>>();
const mockJson = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();

jest.unstable_mockModule("../../repositories/commentsRepository.js", () => ({
  getAllCommentsForRecipe: mockGetAllCommentsForRecipe,
  createCommentForRecipe: mockCreateCommentForRecipe,
  getCommentById: mockGetCommentById,
  deleteCommentById: mockDeleteCommentById,
}));

jest.unstable_mockModule("../../repositories/recipesRepository.js", () => ({
  getRecipeById: mockGetRecipeById,
}));

const { getAllCommentsForRecipe, createCommentForRecipe } = await import(
  "../../controllers/commentsController.js"
);

const { deleteCommentById } = await import(
  "../../controllers/commentsController.js"
);

const mockRes = {
  status: mockStatus.mockReturnValue({ json: mockJson, send: mockSend }),
} as unknown as Response;

const buildRequest = (overrides: Partial<Request> = {}) =>
  ({
    params: { recipeId: "1" },
    user: { id: 1, username: "owner" },
    ...overrides,
  }) as unknown as Request;

afterEach(() => {
  jest.clearAllMocks();
  mockStatus.mockReturnValue({ json: mockJson, send: mockSend });
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

describe("createCommentForRecipe", () => {
  it("returns 201 with the newly created comment in the profile-enriched shape", async () => {
    const createdComment = {
      id: 1,
      body: "Love it!",
      recipe_id: 1,
      created_at: "2024-01-01T00:00:00.000Z",
      username: "owner",
      profile_image: "owner.jpg",
    };

    mockGetRecipeById.mockResolvedValue({ username: "owner" });
    mockCreateCommentForRecipe.mockResolvedValue(createdComment);
    const req = buildRequest({
      body: { body: "Love it!" },
      user: { id: 7, username: "owner" } as Request["user"],
    });

    await createCommentForRecipe(req, mockRes);

    expect(mockGetRecipeById).toHaveBeenCalledWith(1);
    expect(mockCreateCommentForRecipe).toHaveBeenCalledWith(1, 7, "Love it!");
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith(createdComment);
  });
});

describe("deleteCommentById", () => {
  it("returns 400 when the comment ID is not a number", async () => {
    const req = buildRequest({ params: { commentId: "abc" } });

    await deleteCommentById(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Comment ID must be a number",
    });
    expect(mockGetCommentById).not.toHaveBeenCalled();
    expect(mockDeleteCommentById).not.toHaveBeenCalled();
  });

  it("returns 400 when the comment ID is not positive", async () => {
    const req = buildRequest({ params: { commentId: "0" } });

    await deleteCommentById(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Comment ID must be a positive number",
    });
    expect(mockGetCommentById).not.toHaveBeenCalled();
    expect(mockDeleteCommentById).not.toHaveBeenCalled();
  });

  it("returns 401 when the user is not authenticated", async () => {
    const req = buildRequest({
      params: { commentId: "1" },
      user: undefined,
    });

    await deleteCommentById(req, mockRes);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(mockGetCommentById).not.toHaveBeenCalled();
    expect(mockDeleteCommentById).not.toHaveBeenCalled();
  });

  it("returns 404 when the comment does not exist", async () => {
    mockGetCommentById.mockResolvedValue(undefined);
    const req = buildRequest({ params: { commentId: "1" } });

    await deleteCommentById(req, mockRes);

    expect(mockGetCommentById).toHaveBeenCalledWith(1);
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ error: "Comment not found: 1" });
    expect(mockDeleteCommentById).not.toHaveBeenCalled();
  });

  it("returns 403 when a different user tries to delete the comment", async () => {
    mockGetCommentById.mockResolvedValue({ username: "other-user" });
    const req = buildRequest({
      params: { commentId: "1" },
      user: { id: 1, username: "owner" },
    });

    await deleteCommentById(req, mockRes);

    expect(mockGetCommentById).toHaveBeenCalledWith(1);
    expect(mockStatus).toHaveBeenCalledWith(403);
    expect(mockJson).toHaveBeenCalledWith({ error: "Forbidden" });
    expect(mockDeleteCommentById).not.toHaveBeenCalled();
  });

  it("returns 204 after deleting the comment owned by the user", async () => {
    mockGetCommentById.mockResolvedValue({ username: "owner" });
    mockDeleteCommentById.mockResolvedValue();
    const req = buildRequest({
      params: { commentId: "1" },
      user: { id: 7, username: "owner" },
    });

    await deleteCommentById(req, mockRes);

    expect(mockGetCommentById).toHaveBeenCalledWith(1);
    expect(mockDeleteCommentById).toHaveBeenCalledWith(1, 7);
    expect(mockStatus).toHaveBeenCalledWith(204);
    expect(mockSend).toHaveBeenCalled();
  });
});
