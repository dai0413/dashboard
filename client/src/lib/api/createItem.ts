import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";

type CreateParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  onAfterCreate: (item: any) => void;
  handleLoading: (time: "start" | "end") => void;
  handleSetAlert: (value: ResponseStatus) => void;
};

export const createItemBase = async ({
  apiInstance,
  data,
  backendRoute,
  onAfterCreate,
  handleLoading,
  handleSetAlert,
}: CreateParams) => {
  handleLoading("start");
  let alert: ResponseStatus = { success: false };
  try {
    const res = await apiInstance.post(backendRoute, data);
    onAfterCreate(res.data.data);
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
