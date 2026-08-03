import type { Request, Response } from "express";
import * as CommentsRepository from "../repositories/commentsRepository.js";
import { getRecipeById } from "../repositories/recipesRepository.js";

export const getAllCommentsForRecipe = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const recipeId = parseInt(request.params.recipeId as string, 10);
  if (Number.isNaN(recipeId)) {
    console.log(`Invalid recipe ID: ${request.params.recipeId}`);
    response.status(400).json({ error: "Recipe ID must be a number" });
    return;
  }

  if (recipeId <= 0) {
    console.log(`Invalid recipe ID: ${request.params.recipeId}`);
    response.status(400).json({ error: "Recipe ID must be a positive number" });
    return;
  }

  const recipe = await getRecipeById(recipeId);

  if (!recipe) {
    console.log(`Recipe not found: ${recipeId}`);
    response.status(404).json({ error: `Recipe not found: ${recipeId}` });
    return;
  }

  const comments = await CommentsRepository.getAllCommentsForRecipe(recipeId);
  response.status(200).json(comments);
};

export const createCommentForRecipe = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const recipeId = parseInt(request.params.recipeId as string, 10);
  if (Number.isNaN(recipeId)) {
    console.log(`Invalid recipe ID: ${request.params.recipeId}`);
    response.status(400).json({ error: "Recipe ID must be a number" });
    return;
  }

  if (recipeId <= 0) {
    console.log(`Invalid recipe ID: ${request.params.recipeId}`);
    response.status(400).json({ error: "Recipe ID must be a positive number" });
    return;
  }

  if (!request.user?.id) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const recipe = await getRecipeById(recipeId);
  if (!recipe) {
    console.log(`Recipe not found: ${recipeId}`);
    response.status(404).json({ error: `Recipe not found: ${recipeId}` });
    return;
  }

  const body = request.body?.body;
  if (typeof body !== "string" || body.trim() === "") {
    response.status(400).json({ error: "Comment body is required" });
    return;
  }

  const comment = await CommentsRepository.createCommentForRecipe(
    recipeId,
    request.user.id,
    body.trim(),
  );

  response.status(201).json(comment);
};

export const deleteCommentById = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const commentId = parseInt(request.params.commentId as string, 10);
  if (Number.isNaN(commentId)) {
    console.log(`Invalid comment ID: ${request.params.commentId}`);
    response.status(400).json({ error: "Comment ID must be a number" });
    return;
  }

  if (commentId <= 0) {
    console.log(`Invalid comment ID: ${request.params.commentId}`);
    response
      .status(400)
      .json({ error: "Comment ID must be a positive number" });
    return;
  }

  if (!request.user?.username) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const comment = await CommentsRepository.getCommentById(commentId);

  if (!comment) {
    console.log(`Comment not found: ${commentId}`);
    response.status(404).json({ error: `Comment not found: ${commentId}` });
    return;
  }

  if (comment.username !== request.user.username) {
    console.log(
      `User ${request.user.username} is not authorized to delete comment ${commentId}`,
    );
    response.status(403).json({ error: "Forbidden" });
    return;
  }

  await CommentsRepository.deleteCommentById(commentId, request.user.id);
  response.status(204).send();
};
