import { apiFetch } from "./apiUtils";

export const getRecipes = async (category = null) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const query = params.toString() ? `?${params}` : "";
  return apiFetch(`/recipes${query}`);
};

export const getRecipeById = async (id) => apiFetch(`/recipes/${id}`);
