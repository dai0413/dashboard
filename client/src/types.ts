export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };
};
