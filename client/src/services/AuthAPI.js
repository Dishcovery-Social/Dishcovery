import { apiFetch } from "./apiUtils";

export const getCurrentUser = async () => apiFetch("/auth/me");

export const logout = async () => apiFetch("/auth/logout", { method: "POST" });
