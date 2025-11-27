export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: any;
  };
};

export type AlertStatus = {
  success: boolean | null;
  message?: string;
  errors?: Record<string, string[]>;
};
