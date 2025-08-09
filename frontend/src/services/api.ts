import { getToken } from "@/lib/token";
import axios, { InternalAxiosRequestConfig } from "axios";

// Use proper type instead of 'any'
const API_URL = "https://signalyze-backend.onrender.com/api/v1";
// const API_URL = "http://localhost:5001/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
