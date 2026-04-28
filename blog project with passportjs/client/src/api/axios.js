import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const backendOrigin = apiBaseUrl.replace(/\/api$/, "");

const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export { backendOrigin };
export default API;
