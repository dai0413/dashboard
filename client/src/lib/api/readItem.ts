import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError, ReadItemResponse } from "@dai0413/myorg-shared";

type ReadItemParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const readItemBase = async <Data>({
  apiInstance,
  backendRoute,
  handleLoading,
  handleSetAlert,
}: ReadItemParams) => {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.get(backendRoute);
    const responseData: ReadItemResponse<Data> = res.data;
    alert = { success: true };

    return responseData.data;
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
