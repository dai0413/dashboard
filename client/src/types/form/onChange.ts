import { AxiosInstance } from "axios";
import { FormUpdatePair } from "./common";

export type OnChange<T> = (
  data: Partial<T>,
  api?: AxiosInstance,
) => Promise<FormUpdatePair>;
