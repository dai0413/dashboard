import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";

type UpdateParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  onAfterUpdate: (item: any) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: ResponseStatus) => void;
};

export const updateItemBase = async ({
  apiInstance,
  data,
  backendRoute,
  onAfterUpdate,
  handleLoading,
  handleSetAlert,
}: UpdateParams) => {
  handleLoading && handleLoading("start");
  let alert: ResponseStatus = { success: false };
  let result = false;
  try {
    const res = await apiInstance.patch(backendRoute, data);
    onAfterUpdate(res.data.data);
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

    return result;
  }
};
