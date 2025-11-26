import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";

// --- 比較演算子をサポートする値型 ---
export type QueryValue =
  | string
  | number
  | boolean
  | Date
  | `${">" | "<" | ">=" | "<=" | "!=" | "="}${string | number}`
  | Array<string | number | boolean | Date>
  | "exists"
  | "not_exists";

// --- クエリパラメータの型 ---
export type QueryParams = Record<string, QueryValue> & {
  filters?: string;
  sorts?: string;
  getAll?: boolean;
};

export type ResBody<DATA> = {
  data: DATA;
  totalCount: number;
  page: number;
  pageSize: number;
};

type ReadItemsParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  params?: QueryParams;
  onSuccess?: (data: ResBody<any>) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: ResponseStatus) => void;
};

export const readItemsBase = async ({
  apiInstance,
  params,
  backendRoute,
  onSuccess,
  handleLoading,
  handleSetAlert,
  returnResponse = false,
}: ReadItemsParams & { returnResponse?: boolean }) => {
  handleLoading && handleLoading("start");
  let alert: ResponseStatus = { success: false };
  try {
    const res = await apiInstance.get(backendRoute, {
      params,
    });
    onSuccess && onSuccess(res.data);
    alert = { success: true, message: res.data?.message };

    if (returnResponse) return res.data;
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    alert = {
      success: false,
      errors: apiError.error?.errors,
      message: apiError.error?.message,
    };

    if (returnResponse) throw apiError;
  } finally {
    handleSetAlert && handleSetAlert(alert);
    handleLoading && handleLoading("end");
  }
};
