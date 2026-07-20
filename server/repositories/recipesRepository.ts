import { pool } from "../config/database.js";

export const getAllRecipes = async () => {
  const results = await pool.query("SELECT * FROM recipes ORDER BY id ASC");
  return results.rows;
};
