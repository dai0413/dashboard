import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";
import { CrudRouteWithParams } from "../apiRoutes";

type ReadItemsParams<R extends CrudRouteWithParams<any>> = {
  apiInstance: AxiosInstance;
  backendRoute: R;
  path?: R["path"];
  params?: R["params"];
  onSuccess: (data: any) => void;
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
}: ReadItemsParams<R>) => {
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
    onSuccess(res.data.data);
    alert = { success: true, message: res.data?.message };
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    alert = {
      success: false,
      errors: apiError.error?.errors,
      message: apiError.error?.message,
    };
  } finally {
    handleSetAlert && handleSetAlert(alert);
    handleLoading && handleLoading("end");
  }
};
