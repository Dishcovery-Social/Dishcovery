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
