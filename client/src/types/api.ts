import { ModelType } from "./models";
export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };
};

export type DataResoonse = {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type ResponseStatus = {
  success: boolean | null;
  message?: string;
  errors?: Record<string, string[]>;
};

export type ReadItemsParamsMap = {
  [ModelType.COMPETITION_STAGE]: {
    season?: string;
    competition?: string;
  };
  [ModelType.COMPETITION]: {
    country?: string;
  };
  [ModelType.COUNTRY]: {};
  [ModelType.MATCH_FORMAT]: {};
  [ModelType.MATCH]: {
    team?: string;
    season?: string;
    competition?: string;
  };
  [ModelType.INJURY]: {
    latest?: boolean;
    limit?: number;
    player?: string;
    now_team?: string;
  };
  [ModelType.NATIONAL_CALLUP]: {
    country?: string;
    player?: string;
    series?: string;
  };
  [ModelType.NATIONAL_MATCH_SERIES]: {
    country?: string;
  };
  [ModelType.PLAYER]: {};
  [ModelType.REFEREE]: {};
  [ModelType.SEASON]: {
    competition?: string;
    current?: boolean;
  };
  [ModelType.STADIUM]: {};
  [ModelType.TEAM_COMPETITION_SEASON]: {
    competition?: string;
    season?: string;
    team?: string;
    competition_category?: string;
  };
  [ModelType.TEAM]: {};
  [ModelType.TRANSFER]: {
    limit?: number;
    player?: string;
    team?: string;
    from_team?: string;
    to_team?: string;
    form?: string;
    from_date?: string;
    to_date?: string;
  };

  CURRENT_PLAYERS_BY_TEAM: {
    from_date_from?: string;
    from_date_to?: string;
  };
};
