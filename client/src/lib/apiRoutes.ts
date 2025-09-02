export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type BaseCrudRoutes = {
  GET_ALL: string;
  CREATE: string;
  DETAIL: (id: string | number) => string;
  UPDATE: (id: string | number) => string;
  DELETE: (id: string | number) => string;
  UPLOAD?: string;
  DOWNLOAD?: string;
};

type Model = {
  COMPETITION: BaseCrudRoutes;
  COUNTRY: BaseCrudRoutes;
  INJURY: BaseCrudRoutes;
  NATIONAL_CALLUP: BaseCrudRoutes;
  NATIONAL_MATCH_SERIES: BaseCrudRoutes;
  PLAYER: BaseCrudRoutes & {
    CHECK: string;
  };
  REFEREE: BaseCrudRoutes;
  SEASON: BaseCrudRoutes;
  TEAM: BaseCrudRoutes;
  TRANSFER: BaseCrudRoutes;
};

export const API_ROUTES: Model & {
  AUTH: {
    REGISTER: string;
    LOGIN: string;
    LOGOUT: string;
    ME: string;
    REFRESH: string;
  };
  TOP_PAGE: {
    GET: string;
  };
  AGGREGATE: {
    NO_CALLUP: (countryId: string | number) => string;
    CURRENT_PLAYERS_BY_TEAM: (teamId: string | number) => string;
    CURRENT_LOANS_BY_TEAM: (teamId: string | number) => string;
    NO_NUMBER: (countryId: string | number) => string;
  };
} = {
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
  COMPETITION: {
    GET_ALL: `${API_BASE_URL}/competition`,
    CREATE: `${API_BASE_URL}/competition`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/competition/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/competition/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/competition/${id}`,
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
  REFEREE: {
    GET_ALL: `${API_BASE_URL}/referee`,
    CREATE: `${API_BASE_URL}/referee`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/referee/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/referee/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/referee/${id}`,
  },
  SEASON: {
    GET_ALL: `${API_BASE_URL}/season`,
    CREATE: `${API_BASE_URL}/season`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/season/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/season/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/season/${id}`,
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
  },
  AGGREGATE: {
    NO_CALLUP: (countryId: string | number) =>
      `${API_BASE_URL}/aggregate/national-callup/series-count/${countryId}`,
    CURRENT_PLAYERS_BY_TEAM: (teamId: string | number) =>
      `${API_BASE_URL}/aggregate/transfer/current-players/${teamId}`,
    CURRENT_LOANS_BY_TEAM: (teamId: string | number) =>
      `${API_BASE_URL}/aggregate/transfer/current-loans/${teamId}`,
    NO_NUMBER: (countryId: string | number) =>
      `${API_BASE_URL}/aggregate/transfer/no-number/${countryId}`,
  },
};
