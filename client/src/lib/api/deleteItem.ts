import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from "@myorg/shared";

type DeleteParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  onAfterDelete: () => void;

  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const deleteItemBase = async ({
  apiInstance,
  backendRoute,
  onAfterDelete,
  handleLoading,
  handleSetAlert,
}: DeleteParams) => {
  handleLoading && handleLoading("start");
  let result: boolean;
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.delete(backendRoute);
    onAfterDelete();
    alert = { success: true, message: res.data?.message };
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
