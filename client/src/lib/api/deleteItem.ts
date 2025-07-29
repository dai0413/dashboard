import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";

type DeleteParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  onAfterDelete: () => void;

  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: ResponseStatus) => void;
};

export const deleteItemBase = async ({
  apiInstance,
  backendRoute,
  onAfterDelete,
  handleLoading,
  handleSetAlert,
}: DeleteParams) => {
  handleLoading && handleLoading("start");
  let alert: ResponseStatus = { success: false };
  try {
    const res = await apiInstance.delete(backendRoute);
    onAfterDelete();
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
