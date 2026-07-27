import { pool } from "../config/database.js";
import type { Category } from "../types/category.js";

export const getAllCategories = async (): Promise<Category[]> => {
  const results = await pool.query<Category>(`SELECT * FROM categories`);
  return results.rows;
};
