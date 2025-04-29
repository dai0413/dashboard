import axios from "axios";
import { API_ROUTES } from "./apiRoutes";
import { APP_ROUTES } from "./appRoutes";
import { getAccessToken } from "../context/auth-context";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// リクエスト時にauthorizationヘッダー付与
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスでアクセストークンの期限切れを検知して再発行
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // login, register, refresh自体にはリフレッシュ試みない
    const skipRetryUrls = [
      API_ROUTES.AUTH.LOGIN,
      API_ROUTES.AUTH.REGISTER,
      API_ROUTES.AUTH.REFRESH,
    ];

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRetryUrls.includes(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          API_ROUTES.AUTH.REFRESH,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // api共通ヘッダーも更新
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // 失敗したリクエストをリトライ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token failed", refreshError);

        // リフレッシュトークンすら失敗したらログアウトさせる
        window.location.href = APP_ROUTES.LOGIN;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
