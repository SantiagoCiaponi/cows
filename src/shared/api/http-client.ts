// shared/api/http-client.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSessionStore } from "@/shared/session";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const httpClient = axios.create({ baseURL });

// instancia separada, sin interceptores, para pedir el refresh sin loopear
// si el propio refresh devuelve 401 (evita que el interceptor de respuesta se reintente a si mismo)
const refreshClient = axios.create({ baseURL });

httpClient.interceptors.request.use((config) => {
  const { accessToken } = getSessionStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function resolvePendingRequests(token: string | null) {
  pendingRequests.forEach((resolve) => resolve(token));
  pendingRequests = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const { refreshToken, clearSession, setSession, user } = getSessionStore.getState();
    if (!refreshToken) {
      clearSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // si ya hay un refresh en curso, encolar esta request y reintentarla cuando termine
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(httpClient(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const response = await refreshClient.post("/api/auth/refresh", { refreshToken });
      const auth = response.data as { accessToken: string; refreshToken: string };
      setSession({ user, accessToken: auth.accessToken, refreshToken: auth.refreshToken });
      resolvePendingRequests(auth.accessToken);
      originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`;
      return httpClient(originalRequest);
    } catch (refreshError) {
      resolvePendingRequests(null);
      clearSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
