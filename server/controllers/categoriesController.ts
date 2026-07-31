import type { Request, Response } from "express";
import * as CategoriesRepository from "../repositories/categoriesRepository.js";

export const categoryNormalization = (category: string): string => {
  return category.trim().toLowerCase();
};

export const categoryValidation = (category: string): boolean => {
  if (typeof category !== "string") return false;
  const trimmed = category.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
};

export const categoriesValidation = (categories: string[]): boolean => {
  if (!Array.isArray(categories)) {
    return false;
  }

  return categories.every((category) => categoryValidation(category));
};

export const getAllCategories = async (
  _request: Request,
  response: Response,
): Promise<void> => {
  const categories = await CategoriesRepository.getAllCategories();
  response.status(200).json(categories);
};
