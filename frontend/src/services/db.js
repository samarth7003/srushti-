const API_URL = "http://localhost:5000/api";

// Helper to make API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Something went wrong");
  }
  return response.json();
};

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

// Categories CRUD functions
export const getCategories = () => apiCall("/categories");

export const addCategory = (category) => apiCall("/categories", {
  method: "POST",
  body: JSON.stringify({ name: category }),
});

export const deleteCategory = (category) => apiCall(`/categories/${encodeURIComponent(category)}`, {
  method: "DELETE",
});

// Order CRUD functions
export const getOrders = () => apiCall("/orders");

export const createOrder = (orderData) => apiCall("/orders", {
  method: "POST",
  body: JSON.stringify(orderData),
});

export const updateOrderStatus = (orderId, status) => apiCall(`/orders/${orderId}/status`, {
  method: "PUT",
  body: JSON.stringify({ orderStatus: status }),
});

export const approveUpiPayment = (orderId) => apiCall(`/orders/${orderId}/approve-payment`, {
  method: "PUT",
});

// Reviews CRUD functions
export const getReviews = () => apiCall("/reviews");

export const addReview = (review) => apiCall("/reviews", {
  method: "POST",
  body: JSON.stringify(review),
});
