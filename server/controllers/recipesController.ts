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
    throw new Error("Invalid recipe ID");
  }
  const recipe = await RecipesRepository.getRecipeById(id);
  if (!recipe) {
    response.status(404).json({ error: "Recipe not found" });
    return;
  }
  response.status(200).json(recipe);
};
