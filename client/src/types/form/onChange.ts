import { AxiosInstance } from "axios";

export type OnChange<T> = (
  formData: T,
  formLabel: Record<string, any>,
  api?: AxiosInstance,
) => Promise<{
  formData: Partial<T>;
  formLabel: Partial<Record<string, any>>;
}>;
