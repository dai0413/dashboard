import { AxiosInstance } from "axios";
import { APIError, ReadItemsParamsMap, ResponseStatus } from "../../types/api";

type ReadItemsParams<K extends keyof ReadItemsParamsMap> = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  params?: ReadItemsParamsMap[K];
  onSuccess: (data: any) => void;

  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: ResponseStatus) => void;
};

export const readItemsBase = async <K extends keyof ReadItemsParamsMap>({
  apiInstance,
  backendRoute,
  params,
  onSuccess,
  handleLoading,
  handleSetAlert,
}: ReadItemsParams<K>) => {
  handleLoading && handleLoading("start");
  let alert: ResponseStatus = { success: false };
  try {
    const res = await apiInstance.get(backendRoute, {
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
