export type AlertStatus = {
  success: boolean | null;
  message?: string;
  errors?: Record<string, string[]>;
};
