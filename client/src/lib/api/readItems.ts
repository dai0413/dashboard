import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError, ResBody, QueryParams } from "@dai0413/myorg-shared";
import { DataResoonse } from "../../types/api";

type ReadItemsParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  params?: QueryParams;
  onSuccess?: (data: ResBody<any>) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
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
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.get(backendRoute, {
      params,
    });
    onSuccess && onSuccess(res.data);
    alert = { success: true, message: res.data?.message };

    if (returnResponse) return res.data as DataResoonse;
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
