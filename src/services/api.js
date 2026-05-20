import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {},
});

api.interceptors.request.use((config) => {
  console.log("Procesamos petición", config);
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Recibimos respuesta", response);
    return response;
  },
  (error) => {
    console.log("Recibimos error", error);
    return Promise.reject(error);
  },
);

export default api;
