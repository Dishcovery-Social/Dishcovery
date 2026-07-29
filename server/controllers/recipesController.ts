import type { Request, Response } from "express";
import * as RecipesRepository from "../repositories/recipesRepository.js";

export const getAllRecipes = async (
  _request: Request,
  response: Response,
): Promise<void> => {
  const recipes = await RecipesRepository.getAllRecipes();
  response.status(200).json(recipes);
};

export const getRecipeById = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const id = parseInt(request.params.id as string, 10);
  if (Number.isNaN(id)) {
    console.log(`Invalid recipe ID: ${request.params.id}`);
    response.status(400).json({ error: "Invalid recipe ID" });
    return;
  }
  const recipe = await RecipesRepository.getRecipeById(id);
  if (!recipe) {
    console.log(`Recipe not found: ${id}`);
    response.status(404).json({ error: `Recipe not found: ${id}` });
    return;
  }
  response.status(200).json(recipe);
};

export const deleteRecipe = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const { id } = request.params;
  const recipeId = parseInt(id, 10);

  try {
    if (Number.isNaN(recipeId)) {
      response.status(400).json({ error: "Invalid recipe ID" });
      return;
    }

    const userId = request.user?.id;
    if (!userId) {
      response.status(401).json({ error: "User not authenticated" });
      return;
    }

    const wasDeleted = await RecipesRepository.deleteRecipeById(
      recipeId,
      userId,
    );
    if (!wasDeleted) {
      response.status(404).json({ error: `Recipe not found: ${recipeId}` });
      return;
    }

    response
      .status(200)
      .json({ message: `Recipe deleted successfully: ${recipeId}` });
  } catch (error) {
    console.log(`Error deleting recipe: ${recipeId}`, error);
    response
      .status(500)
      .json({ error: `Failed to delete recipe: ${recipeId}` });
  }
};
