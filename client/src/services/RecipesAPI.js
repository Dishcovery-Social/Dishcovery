import { apiFetch } from "./apiUtils";

export const getRecipes = async () => apiFetch("/recipes");
