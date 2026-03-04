import axios from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let getAccessToken: () => string | null = () => null;

export const setAccessTokenGetter = (getter: () => string | null) => {
  getAccessToken = getter;
};

export const setupInterceptors = (refresh: any, logout: any) => {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await api.post(API_PATHS.AUTH.REFRESH);
          const newAccessToken = res.data.accessToken;

          refresh(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (err) {
          logout();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );
};
