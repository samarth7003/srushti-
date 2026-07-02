import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor to attach Authorization token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("srushti_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Wrapper to match existing options layout (method, body as JSON string)
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await API({
      url: endpoint,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers,
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || "Something went wrong";
    throw new Error(errorMsg);
  }
};
