import { ReadItemsParamsMap } from "../types/api";
import { ModelType } from "../types/models";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type CrudRouteWithParams<P = undefined> = {
  URL: string | ((id?: string | number) => string);
  path?: string | number;
  params?: P; // P が undefined ならパラメータなし
};

type BaseCrudRoutes<P = {}> = {
  GET_ALL: CrudRouteWithParams<P>;
  CREATE: string;
  DETAIL: (id: string | number) => string;
  UPDATE: (id: string | number) => string;
  DELETE: (id: string | number) => string;
  UPLOAD?: string;
  DOWNLOAD?: string;
};

type Model = {
  COMPETITION_STAGE: BaseCrudRoutes<
    ReadItemsParamsMap[ModelType.COMPETITION_STAGE]
  >;
  COMPETITION: BaseCrudRoutes<ReadItemsParamsMap[ModelType.COMPETITION]>;
  COUNTRY: BaseCrudRoutes<ReadItemsParamsMap[ModelType.COUNTRY]>;
  INJURY: BaseCrudRoutes<ReadItemsParamsMap[ModelType.INJURY]>;
  MATCH_FORMAT: BaseCrudRoutes<ReadItemsParamsMap[ModelType.MATCH_FORMAT]>;
  MATCH: BaseCrudRoutes<ReadItemsParamsMap[ModelType.MATCH]>;
  NATIONAL_CALLUP: BaseCrudRoutes<
    ReadItemsParamsMap[ModelType.NATIONAL_CALLUP]
  >;
  NATIONAL_MATCH_SERIES: BaseCrudRoutes<
    ReadItemsParamsMap[ModelType.NATIONAL_MATCH_SERIES]
  >;
  PLAYER: BaseCrudRoutes<ReadItemsParamsMap[ModelType.PLAYER]> & {
    CHECK: string;
  };
  REFEREE: BaseCrudRoutes<ReadItemsParamsMap[ModelType.REFEREE]>;
  SEASON: BaseCrudRoutes<ReadItemsParamsMap[ModelType.SEASON]>;
  STADIUM: BaseCrudRoutes<ReadItemsParamsMap[ModelType.STADIUM]>;
  TEAM_COMPETITION_SEASON: BaseCrudRoutes<
    ReadItemsParamsMap[ModelType.TEAM_COMPETITION_SEASON]
  >;
  TEAM: BaseCrudRoutes<ReadItemsParamsMap[ModelType.TEAM]>;
  TRANSFER: BaseCrudRoutes<ReadItemsParamsMap[ModelType.TRANSFER]>;
};

// Aggregate用
type Aggregate = {
  NO_CALLUP: CrudRouteWithParams<{}>;
  CURRENT_PLAYERS_BY_TEAM: CrudRouteWithParams<
    ReadItemsParamsMap["CURRENT_PLAYERS_BY_TEAM"]
  >;
  CURRENT_LOANS_BY_TEAM: CrudRouteWithParams<{}>;
  NO_NUMBER: CrudRouteWithParams<{
    competition?: string;
    startData?: string;
    endDate?: string;
  }>;
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
  AGGREGATE: Aggregate;
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
  COMPETITION_STAGE: {
    GET_ALL: { URL: `${API_BASE_URL}/competition-stage` },
    CREATE: `${API_BASE_URL}/competition-stage`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/competition-stage/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/competition-stage/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/competition-stage/${id}`,
  },
  COMPETITION: {
    GET_ALL: { URL: `${API_BASE_URL}/competition` },
    CREATE: `${API_BASE_URL}/competition`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/competition/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/competition/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/competition/${id}`,
  },
  COUNTRY: {
    GET_ALL: { URL: `${API_BASE_URL}/country` },
    CREATE: `${API_BASE_URL}/country`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/country/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/country/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/country/${id}`,
  },
  INJURY: {
    GET_ALL: { URL: `${API_BASE_URL}/injury` },
    CREATE: `${API_BASE_URL}/injury`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/injury/${id}`,
  },
  MATCH_FORMAT: {
    GET_ALL: { URL: `${API_BASE_URL}/match-format` },
    CREATE: `${API_BASE_URL}/match-format`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/match-format/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/match-format/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/match-format/${id}`,
  },
  MATCH: {
    GET_ALL: { URL: `${API_BASE_URL}/match` },
    CREATE: `${API_BASE_URL}/match`,
    UPLOAD: `${API_BASE_URL}/match/upload`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/match/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/match/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/match/${id}`,
  },
  NATIONAL_CALLUP: {
    GET_ALL: { URL: `${API_BASE_URL}/national-callup` },
    CREATE: `${API_BASE_URL}/national-callup`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/national-callup/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/national-callup/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/national-callup/${id}`,
  },
  NATIONAL_MATCH_SERIES: {
    GET_ALL: { URL: `${API_BASE_URL}/national-match-series` },
    CREATE: `${API_BASE_URL}/national-match-series`,
    DOWNLOAD: `${API_BASE_URL}/national-match-series/download`,
    DETAIL: (id: string | number) =>
      `${API_BASE_URL}/national-match-series/${id}`,
    UPDATE: (id: string | number) =>
      `${API_BASE_URL}/national-match-series/${id}`,
    DELETE: (id: string | number) =>
      `${API_BASE_URL}/national-match-series/${id}`,
  },
  PLAYER: {
    GET_ALL: { URL: `${API_BASE_URL}/player` },
    CREATE: `${API_BASE_URL}/player`,
    CHECK: `${API_BASE_URL}/player/check`,
    UPLOAD: `${API_BASE_URL}/player/upload`,
    DOWNLOAD: `${API_BASE_URL}/player/download`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/player/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/player/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/player/${id}`,
  },
  REFEREE: {
    GET_ALL: { URL: `${API_BASE_URL}/referee` },
    CREATE: `${API_BASE_URL}/referee`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/referee/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/referee/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/referee/${id}`,
  },
  SEASON: {
    GET_ALL: { URL: `${API_BASE_URL}/season` },
    CREATE: `${API_BASE_URL}/season`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/season/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/season/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/season/${id}`,
  },
  STADIUM: {
    GET_ALL: { URL: `${API_BASE_URL}/stadium` },
    CREATE: `${API_BASE_URL}/stadium`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/stadium/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/stadium/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/stadium/${id}`,
  },
  TEAM_COMPETITION_SEASON: {
    GET_ALL: {
      URL: `${API_BASE_URL}/team-competition-season`,
    },
    CREATE: `${API_BASE_URL}/team-competition-season`,
    DOWNLOAD: `${API_BASE_URL}/team-competition-season/download`,
    DETAIL: (id: string | number) =>
      `${API_BASE_URL}/team-competition-season/${id}`,
    UPDATE: (id: string | number) =>
      `${API_BASE_URL}/team-competition-season/${id}`,
    DELETE: (id: string | number) =>
      `${API_BASE_URL}/team-competition-season/${id}`,
  },
  TEAM: {
    GET_ALL: { URL: `${API_BASE_URL}/team` },
    CREATE: `${API_BASE_URL}/team`,
    DOWNLOAD: `${API_BASE_URL}/team/download`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/team/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/team/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/team/${id}`,
  },
  TRANSFER: {
    GET_ALL: { URL: `${API_BASE_URL}/transfer` },
    CREATE: `${API_BASE_URL}/transfer`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/transfer/${id}`,
  },
  AGGREGATE: {
    NO_CALLUP: {
      URL: (id) =>
        `${API_BASE_URL}/aggregate/national-callup/series-count/${id}`,
    },
    CURRENT_PLAYERS_BY_TEAM: {
      URL: (id) => `${API_BASE_URL}/aggregate/transfer/current-players/${id}`,
    },
    CURRENT_LOANS_BY_TEAM: {
      URL: (id) => `${API_BASE_URL}/aggregate/transfer/current-loans/${id}`,
    },
    NO_NUMBER: {
      URL: `${API_BASE_URL}/aggregate/transfer/no-number`,
    },
  },
};
