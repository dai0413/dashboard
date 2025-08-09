export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  TOP_PAGE: {
    GET: `${API_BASE_URL}/top-page`,
  },
  COUNTRY: {
    GET_ALL: `${API_BASE_URL}/country`,
    CREATE: `${API_BASE_URL}/country`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/country/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/country/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/country/${id}`,
  },
  INJURY: {
    GET_ALL: `${API_BASE_URL}/injury`,
    CREATE: `${API_BASE_URL}/injury`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
  },
  NATIONAL_CALLUP: {
    GET_ALL: `${API_BASE_URL}/national-callup`,
    CREATE: `${API_BASE_URL}/national-callup`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/national-callup/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/national-callup/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/national-callup/${id}`,
  },
  NATIONAL_MATCH_SERIES: {
    GET_ALL: `${API_BASE_URL}/national-match-series`,
    CREATE: `${API_BASE_URL}/national-match-series`,
    DETAIL: (id: string | number) =>
      `${API_BASE_URL}/national-match-series/${id}`,
    UPDATE: (id: string | number) =>
      `${API_BASE_URL}/national-match-series/${id}`,
    DELETE: (id: string | number) =>
      `${API_BASE_URL}/national-match-series/${id}`,
  },
  PLAYER: {
    GET_ALL: `${API_BASE_URL}/player`,
    CREATE: `${API_BASE_URL}/player`,
    CHECK: `${API_BASE_URL}/player/check`,
    UPLOAD: `${API_BASE_URL}/player/upload`,
    DOWNLOAD: `${API_BASE_URL}/player/download`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/player/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/player/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/player/${id}`,
  },
  TEAM: {
    GET_ALL: `${API_BASE_URL}/team`,
    CREATE: `${API_BASE_URL}/team`,
    DOWNLOAD: `${API_BASE_URL}/team/download`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/team/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/team/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/team/${id}`,
  },
  TRANSFER: {
    GET_ALL: `${API_BASE_URL}/transfer`,
    CREATE: `${API_BASE_URL}/transfer`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
    CURRENT_PLAYERS_BY_TEAM: (teamId: string | number) =>
      `${API_BASE_URL}/transfer/current-players/${teamId}`,
    CURRENT_LOANS_BY_TEAM: (teamId: string | number) =>
      `${API_BASE_URL}/transfer/current-loans/${teamId}`,
  },
};
