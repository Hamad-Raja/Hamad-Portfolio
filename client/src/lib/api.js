import axios from "axios";
import { site } from "../config/site.js";
import { clearToken } from "./storage.js";

export const API_URL = site.apiUrl;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

api.interceptors.response.use(response => {
  if (response.config.url?.startsWith("/api/") && !response.headers["content-type"]?.includes("application/json")) {
    return Promise.reject(new Error("The API returned an unexpected response"));
  }
  return response;
}, error => {
  if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
    clearToken();
    setAuthToken("");
    window.dispatchEvent(new Event("auth-expired"));
  }
  return Promise.reject(error);
});
