import axios from "axios";
import { useAuth } from "./auth-context";

export const useApi = () => {
  const { accessToken /*refresh*/ } = useAuth();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    // timeout: 10000,
  });

  // アクセストークン付与
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // レスポンスで401を検知 → リフレッシュ処理
  // api.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;

  //     if (
  //       error.response?.status === 401 &&
  //       !originalRequest._retry &&
  //       !skipRetry(originalRequest.url)
  //     ) {
  //       originalRequest._retry = true;

  //       try {
  //         if (!refreshPromise) {
  //           refreshPromise = axios
  //             .post(API_ROUTES.AUTH.REFRESH, {}, { withCredentials: true })
  //             .then((res) => res.data.accessToken)
  //             .finally(() => {
  //               refreshPromise = null;
  //             });
  //         }

  //         const newToken = await refreshPromise;

  //         // Context 内も更新
  //         refresh(newToken);

  //         // apiヘッダー更新
  //         api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  //         originalRequest.headers.Authorization = `Bearer ${newToken}`;

  //         return api(originalRequest); // retry
  //       } catch (refreshError) {
  //         console.error("リフレッシュ失敗", refreshError);
  //         refresh(""); // Contextをリセット
  //         window.location.href = APP_ROUTES.LOGIN;
  //         return Promise.reject(refreshError);
  //       }
  //     }

  //     return Promise.reject(error);
  //   }
  // );

  return api;
};
