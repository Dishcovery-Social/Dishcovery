import { apiFetch } from "./apiUtils";

export const getRecipes = async (category = null) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const query = params.toString() ? `?${params}` : "";
  return apiFetch(`/recipes${query}`);
};

export const getRecipeById = async (id) => apiFetch(`/recipes/${id}`);

export const createRecipe = async (recipe) => {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    };
    const response = await apiFetch(`/recipes`, options);

    console.log(`Successfully created recipe with title ${recipe.title}`);
    return response;
  } catch (error) {
    console.error("Error: Could not create recipe", error);
  }
};
