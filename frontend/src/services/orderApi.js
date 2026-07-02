import { apiCall } from "./apiHelper.js";

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
