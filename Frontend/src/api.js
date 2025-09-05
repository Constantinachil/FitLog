import axios from "axios";
import { getToken } from "./components/auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust to your backend
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
