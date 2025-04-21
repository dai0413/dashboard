export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  PLAYER: {
    GET_ALL: `${API_BASE_URL}/player`,
    CREATE: `${API_BASE_URL}/player`,
    CHECK: `${API_BASE_URL}/player/check`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/player/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/player/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/player/${id}`,
  },
  TRANSFER: {
    GET_ALL: `${API_BASE_URL}/transfer`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
  },
  INJURY: {
    GET_ALL: `${API_BASE_URL}/injury`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
  },
};
