import type { Request, Response } from "express";
import * as RecipesRepository from "../repositories/recipesRepository.js";

export const getAllRecipes = async (
  _request: Request,
  response: Response,
): Promise<void> => {
  const recipes = await RecipesRepository.getAllRecipes();
  response.status(200).json(recipes);
};
