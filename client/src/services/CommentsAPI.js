import { apiFetch } from "./apiUtils";

export const getComments = async (recipeId) =>
  apiFetch(`/recipes/${recipeId}/comments`);

export const createComment = async (recipeId, body) =>
  apiFetch(`/recipes/${recipeId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });

export const deleteComment = async (recipeId, commentId) =>
  apiFetch(`/recipes/${recipeId}/comments/${commentId}`, { method: "DELETE" });
