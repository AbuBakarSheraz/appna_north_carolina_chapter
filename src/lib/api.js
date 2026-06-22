import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../store/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh");

    if (error.response?.status === 401 && !isAuthEndpoint && !original?._retry) {
      original._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.access_token);

        original.headers.Authorization = `Bearer ${data.access_token}`;

        return api(original);
      } catch {
        clearAccessToken();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
