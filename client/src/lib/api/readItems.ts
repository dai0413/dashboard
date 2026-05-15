import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError, QueryParams } from "@dai0413/myorg-shared";
import { ReadItemsResponse } from "../../types";

type ReadItemsParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  params?: QueryParams;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const readItemsBase = async <Data>({
  apiInstance,
  params,
  backendRoute,
  handleLoading,
  handleSetAlert,
}: ReadItemsParams) => {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.get(backendRoute, {
      params,
    });
    const responseData: ReadItemsResponse<Data> = res.data;

    alert = { success: true, message: res.data?.message };

    return responseData;
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
