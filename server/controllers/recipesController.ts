import type { Request, Response } from "express";
import * as RecipesRepository from "../repositories/recipesRepository.js";
import { NewRecipe, Recipe } from "../types/recipe.js";

export const getAllRecipes = async (request: Request, response: Response) => {
	const recipes = await RecipesRepository.getAllRecipes();
	response.status(200).json(recipes);
};
