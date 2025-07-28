import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";

type UpdateParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  onAfterUpdate: (item: any) => void;
  handleLoading: (time: "start" | "end") => void;
  handleSetAlert: (value: ResponseStatus) => void;
};

export const updateItemBase = async ({
  apiInstance,
  data,
  backendRoute,
  onAfterUpdate,
  handleLoading,
  handleSetAlert,
}: UpdateParams) => {
  handleLoading("start");
  let alert: ResponseStatus = { success: false };
  try {
    const res = await apiInstance.patch(backendRoute, data);
    onAfterUpdate(res.data.data);
    alert = { success: true, message: res.data?.message };
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    alert = {
      success: false,
      errors: apiError.error?.errors,
      message: apiError.error?.message,
    };
  } finally {
    handleSetAlert(alert);
    handleLoading("end");
  }
};
