import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";
import { CrudRouteWithParams } from "../apiRoutes";

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
  data: DATA[];
  totalCount: number;
  page: number;
  pageSize: number;
};

type ReadItemsParams<R extends CrudRouteWithParams<any>> = {
  apiInstance: AxiosInstance;
  backendRoute: R;
  path?: R["path"];
  params?: QueryParams;
  onSuccess?: (data: ResBody<any>) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: ResponseStatus) => void;
};

export const readItemsBase = async <
  P,
  R extends CrudRouteWithParams<P> = CrudRouteWithParams<P>
>({
  apiInstance,
  params,
  backendRoute,
  path,
  onSuccess,
  handleLoading,
  handleSetAlert,
  returnResponse = false,
}: ReadItemsParams<R> & { returnResponse?: boolean }) => {
  handleLoading && handleLoading("start");
  let alert: ResponseStatus = { success: false };
  try {
    const url =
      typeof backendRoute.URL === "function"
        ? backendRoute.URL(path)
        : backendRoute.URL;

    const res = await apiInstance.get(url, {
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
