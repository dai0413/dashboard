import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from "@dai0413/myorg-shared";
import { ReadItemResponse } from "../../types";

type ReadItemParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
  returnResponse?: boolean;
};

export const readItemBase = async <Data>({
  apiInstance,
  backendRoute,
  handleLoading,
  handleSetAlert,
  returnResponse,
}: ReadItemParams) => {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.get(backendRoute);
    const responseData: ReadItemResponse<Data> = res.data;
    alert = { success: true };

    if (returnResponse) return responseData.data;
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
