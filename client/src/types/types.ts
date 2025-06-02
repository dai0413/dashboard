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

export type TableHeader = {
  label: string;
  field: string;
};

export type Label = {
  label: string;
  id: string;
};
