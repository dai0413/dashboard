import { ModelType } from "./models";
export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };
};

export type ResponseStatus = {
  success: boolean | null;
  message?: string;
  errors?: Record<string, string[]>;
};

export type ReadItemsParamsMap = {
  [ModelType.PLAYER]: {};
  [ModelType.TRANSFER]: {
    limit?: number;
    player?: string;
    team?: string;
  };
  [ModelType.INJURY]: { limit?: number; player?: string };
  [ModelType.TEAM]: {};
};
