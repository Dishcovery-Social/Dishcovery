import { apiFetch } from "./apiUtils";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/cloudinary/upload", {
    method: "POST",
    body: formData,
  });
};
