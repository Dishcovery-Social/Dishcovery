import { apiFetch } from "./apiUtils";

export const getCategories = async () => apiFetch("/categories");
