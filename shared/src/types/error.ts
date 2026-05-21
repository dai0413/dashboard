export type APIError = {
  error: {
    message: string;
    code: number;
    errors?: Record<string, any>;
  };
};
