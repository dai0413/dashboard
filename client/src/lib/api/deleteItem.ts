import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from "@dai0413/myorg-shared";
import { DeleteItemResponse } from "../../types";

type DeleteParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const deleteItemBase = async ({
  apiInstance,
  backendRoute,
  handleLoading,
  handleSetAlert,
}: DeleteParams) => {
  handleLoading && handleLoading("start");
  let result: boolean;
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.delete(backendRoute);
    const responseData: DeleteItemResponse = res.data;
    alert = { success: true, message: responseData?.message };
    result = true;
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    alert = {
      success: false,
      errors: apiError.error?.errors,
      message: apiError.error?.message,
    };
    result = false;
  } finally {
    handleSetAlert && handleSetAlert(alert);
    handleLoading && handleLoading("end");
  }

  return result;
};
