import type { Request, Response } from "express";
import * as CategoriesRepository from "../repositories/categoriesRepository.js";

export const getAllCategories = async (
  _request: Request,
  response: Response,
): Promise<void> => {
  const categories = await CategoriesRepository.getAllCategories();
  response.status(200).json(categories);
};
