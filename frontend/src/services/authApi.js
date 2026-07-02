import { apiCall } from "./apiHelper.js";

// Auth API endpoints
export const registerUser = (userData) => apiCall("/auth/register", {
  method: "POST",
  body: JSON.stringify(userData),
});

export const loginUser = (credentials) => apiCall("/auth/login", {
  method: "POST",
  body: JSON.stringify(credentials),
});

export const getMe = () => apiCall("/auth/me");
