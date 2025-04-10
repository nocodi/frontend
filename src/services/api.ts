import axios from "axios";

const api = axios.create({
  baseURL: "http://api.nocodi.ir",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
