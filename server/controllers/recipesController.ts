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
  request: Request,
  response: Response,
): Promise<void> => {
  const id = parseInt(request.params.id as string, 10);
  if (Number.isNaN(id)) {
    console.log(`Invalid recipe ID: ${request.params.id}`);
    response.status(400).json({ error: "Invalid recipe ID" });
    return;
  }
  try {
    const wasDeleted = await RecipesRepository.deleteRecipeById(id);
    if (!wasDeleted) {
      response.status(404).json({ error: `Recipe not found: ${id}` });
      return;
    }
  } catch (error) {
    console.log(`Error deleting recipe: ${error}`);
    response.status(500).json({ error: `Error deleting recipe: ${error}` });
    return;
  }
  response.status(200).json({ message: `Recipe deleted successfully: ${id}` });
};
