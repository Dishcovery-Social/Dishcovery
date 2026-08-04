import { apiFetch } from "./apiUtils";

export const getRecipes = async (category = null) => {
  const query = category ? `?category=${category}` : "";
  return apiFetch(`/recipes${query}`);
};

export const getRecipeById = async (id) => apiFetch(`/recipes/${id}`);
