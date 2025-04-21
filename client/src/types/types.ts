export type APIError = {
  error?: {
    code?: number;
    message?: string;
    errors?: Record<string, string[]>;
  };
};

export type TableHeader = {
  label: string;
  field: string;
};
