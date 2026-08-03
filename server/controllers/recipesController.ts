import type { Request, Response } from "express";
import { findOrCreateCategoryIDs } from "../repositories/categoriesRepository.js";
import * as RecipesRepository from "../repositories/recipesRepository.js";
import type { Ingredient, NewRecipe } from "../types/recipe.js";
import {
  categoriesValidation,
  categoryNormalization,
} from "./categoriesController.js";

const validateRecipeData = (
  recipeData: Partial<NewRecipe> & { category?: string[] },
): string | null => {
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

  if (
    "category" in recipeData &&
    recipeData.category !== undefined &&
    recipeData.category !== null
  ) {
    if (!categoriesValidation(recipeData.category)) {
      return "Each category must be a non-empty string with a maximum length of 100 characters";
    }

    recipeData.category = recipeData.category.map((cat: string) =>
      categoryNormalization(cat),
    );
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
    console.error(`Invalid recipe ID: ${request.params.id}`);
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

export const createRecipe = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const recipeData = request.body;

  const requiredFields = [
    "title",
    "ingredients",
    "instructions",
    "image",
    "user_id",
    "category",
  ];

  for (const field of requiredFields) {
    if (!Object.hasOwn(recipeData, field)) {
      response.status(400).json({ error: `${field} is required` });
      return;
    }
  }

  if (
    typeof recipeData.title !== "string" ||
    recipeData.title.trim() === "" ||
    recipeData.title.length > 500
  ) {
    response
      .status(400)
      .json({ error: "Title is required and cannot be empty" });
    return;
  }

  const isValidIngredient = (ingredient: Ingredient): boolean => {
    return (
      typeof ingredient === "object" &&
      ingredient !== null &&
      typeof ingredient.name === "string" &&
      ingredient.name.trim() !== "" &&
      typeof ingredient.quantity === "number" &&
      !Number.isNaN(ingredient.quantity) &&
      typeof ingredient.unit === "string" &&
      ingredient.unit.trim() !== ""
    );
  };

  if (
    !Array.isArray(recipeData.ingredients) ||
    !recipeData.ingredients.every(isValidIngredient)
  ) {
    response.status(400).json({
      error:
        "Ingredients must be an array of objects with name, quantity, and unit",
    });
    return;
  }

  if (
    typeof recipeData.instructions !== "string" ||
    recipeData.instructions.trim() === ""
  ) {
    response
      .status(400)
      .json({ error: "Instructions are required and cannot be empty" });
    return;
  }

  if (typeof recipeData.image !== "string" || recipeData.image.trim() === "") {
    response
      .status(400)
      .json({ error: "Image URL is required and cannot be empty" });
    return;
  }

  if (typeof recipeData.user_id !== "number") {
    const userId = Number(recipeData.user_id);
    if (Number.isNaN(userId) || !Number.isInteger(userId)) {
      response.status(400).json({ error: "User ID must be a number" });
      return;
    }
    recipeData.user_id = userId;
  }

  if (!Array.isArray(recipeData.category)) {
    response.status(400).json({ error: "Category must be an array" });
    return;
  }

  if (
    !recipeData.category.every(
      (cat: unknown) =>
        typeof cat === "string" && cat.length > 0 && cat.length <= 100,
    )
  ) {
    response.status(400).json({
      error:
        "Each category must be a non-empty string with a maximum length of 100 characters",
    });
    return;
  }

  const recipe: NewRecipe = {
    title: recipeData.title.trim(),
    ingredients: recipeData.ingredients.map((ingredient: Ingredient) => ({
      name: ingredient.name.trim(),
      quantity: ingredient.quantity,
      unit: ingredient.unit.trim(),
    })),
    instructions: recipeData.instructions.trim(),
    image: recipeData.image.trim(),
    user_id: recipeData.user_id,
    category: recipeData.category,
  };

  const categories = recipeData.category.map((cat: string) => cat.trim());

  const categoryIDs = await findOrCreateCategoryIDs(categories);
  const newRecipe = await RecipesRepository.createRecipe(recipe, categoryIDs);
  response.status(201).json(newRecipe);
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

  if (request.user.username !== recipe.username) {
    response
      .status(403)
      .json({ error: "User is not the owner of this recipe" });
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
    throw new Error("Database error while updating recipe", { cause: error });
  }
};

export const deleteRecipe = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const { id } = request.params;
  const recipeId = parseInt(id, 10);

  if (Number.isNaN(recipeId)) {
    response.status(400).json({ error: "Invalid recipe ID" });
    return;
  }

  const userId = request.user?.id;
  if (!userId) {
    response.status(401).json({ error: "User not authenticated" });
    return;
  }

  const wasDeleted = await RecipesRepository.deleteRecipeById(recipeId, userId);

  if (!wasDeleted) {
    response.status(404).json({ error: `Recipe not found: ${recipeId}` });
    return;
  }

  response
    .status(200)
    .json({ message: `Recipe deleted successfully: ${recipeId}` });
};
