import { apiFetch } from "./apiUtils";

export const getRecipes = async () => apiFetch("/recipes");
export const getRecipeById = async (id) => apiFetch(`/recipes/${id}`);
