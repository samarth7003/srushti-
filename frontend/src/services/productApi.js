import { apiCall } from "./apiHelper.js";

// Product CRUD functions
export const getProducts = () => apiCall("/products");

export const addProduct = (product) => apiCall("/products", {
  method: "POST",
  body: JSON.stringify(product),
});

export const updateProduct = (updatedProduct) => apiCall(`/products/${updatedProduct.id}`, {
  method: "PUT",
  body: JSON.stringify(updatedProduct),
});

export const deleteProduct = (id) => apiCall(`/products/${id}`, {
  method: "DELETE",
});
