import type { Request, Response } from "express";
import * as RecipesRepository from "../repositories/recipesRepository.js";
import {
  type Ingredient,
  type NewRecipe,
  Recipe,
  RecipeWithProfile,
} from "../types/recipe.js";

const validateRecipeData = (recipeData: Partial<NewRecipe>): string | null => {
  if ("title" in recipeData) {
    if (
      typeof recipeData.title !== "string" ||
      recipeData.title.trim() === "" ||
      recipeData.title.length > 500
    ) {
      return "Title is required and cannot be empty";
    }
  }

  if ("ingredients" in recipeData) {
    const isValidIngredient = (ingredient: Ingredient): boolean =>
      typeof ingredient === "object" &&
      ingredient !== null &&
      typeof ingredient.name === "string" &&
      ingredient.name.trim() !== "" &&
      typeof ingredient.quantity === "number" &&
      !Number.isNaN(ingredient.quantity) &&
      typeof ingredient.unit === "string" &&
      ingredient.unit.trim() !== "";

    if (
      !Array.isArray(recipeData.ingredients) ||
      !recipeData.ingredients.every(isValidIngredient)
    ) {
      return "Ingredients must be an array of objects with name, quantity, and unit";
    }
  }

  if ("instructions" in recipeData) {
    if (
      typeof recipeData.instructions !== "string" ||
      recipeData.instructions.trim() === ""
    ) {
      return "Instructions are required and cannot be empty";
    }
  }

  if ("image" in recipeData) {
    if (
      typeof recipeData.image !== "string" ||
      recipeData.image.trim() === ""
    ) {
      return "Image URL is required and cannot be empty";
    }
  }

  if ("category" in recipeData) {
    if (!Array.isArray(recipeData.category)) {
      return "Category must be an array";
    }

    if (
      !recipeData.category.every(
        (cat) =>
          typeof cat === "string" && cat.trim().length > 0 && cat.length <= 100,
      )
    ) {
      return "Each category must be a non-empty string with a maximum length of 100 characters";
    }
  }

  return null;
};

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

export const patchRecipeById = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const id = parseInt(request.params.id as string, 10);

  if (Number.isNaN(id)) {
    response.status(400).json({ error: "Invalid recipe ID" });
    return;
  }

  if (!request.body || Object.keys(request.body).length === 0) {
    response.status(400).json({ error: "No fields provided for update" });
    return;
  }

  if (request.user?.id === undefined) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const recipe = await RecipesRepository.getRecipeById(id);

  if (!recipe) {
    response.status(404).json({ error: `Recipe not found: ${id}` });
    return;
  }

  if (request.user.id !== recipe.user_id) {
    response.status(403).json({ error: "Forbidden" });
    return;
  }

  const validationError = validateRecipeData(request.body);

  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  try {
    const updatedRecipe = await RecipesRepository.patchRecipeById(
      id,
      request.body,
    );

    response.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};
