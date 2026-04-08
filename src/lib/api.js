import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../store/auth";

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

/* ✅ REGISTER INTERCEPTOR HERE */
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  console.log("🔥 Interceptor Running:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.access_token);

        original.headers.Authorization = `Bearer ${data.access_token}`;

        return api(original);
      } catch {
        clearAccessToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
