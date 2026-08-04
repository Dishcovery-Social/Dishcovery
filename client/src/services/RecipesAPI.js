import { apiFetch } from "./apiUtils";

export const getRecipes = async () => apiFetch("/recipes");
export const getRecipeById = async (id) => apiFetch(`/recipes/${id}`);

export const deleteRecipeById = async (id) => {
  try {
    const options = { method: "DELETE" };
    const response = await apiFetch(`/recipes/${id}`, options);
    console.log(response);
    const data = await response.json();
    console.log(`Successfully deleted recipe with id: ${id}`);
    return data;
  } catch (error) {
    console.error(`Error: could not delete recipe with id: ${id}`);
    console.error(error);
  }
};
