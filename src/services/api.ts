import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://37.152.180.195:4001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  config.headers.Authorization = token;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname != "/login"
    ) {
      localStorage.removeItem("authToken");
      window.location.pathname = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
