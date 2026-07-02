import { apiCall } from "./apiHelper.js";

// Categories CRUD functions
export const getCategories = () => apiCall("/categories");

export const addCategory = (category) => apiCall("/categories", {
  method: "POST",
  body: JSON.stringify({ name: category }),
});

export const deleteCategory = (category) => apiCall(`/categories/${encodeURIComponent(category)}`, {
  method: "DELETE",
});
