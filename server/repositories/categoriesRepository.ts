import { pool } from "../config/database.js";
import type { Category } from "../types/category.js";

export const findOrCreateCategoryIDs = async (
  categoryNames: string[],
): Promise<number[]> => {
  const categories: number[] = [];

  for (const name of categoryNames) {
    // Check if the category already exists
    const existingCategoryResult = await pool.query<Category>(
      "SELECT * FROM categories WHERE name = $1",
      [name],
    );

    if (existingCategoryResult.rows.length > 0) {
      categories.push(existingCategoryResult.rows[0].id);
    } else {
      const insertCategoryResult = await pool.query<Category>(
        "INSERT INTO categories (name) VALUES ($1) RETURNING *",
        [name],
      );
      categories.push(insertCategoryResult.rows[0].id);
    }
  }

  return categories;
};
