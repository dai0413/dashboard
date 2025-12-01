import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from ""@dai0413/myorg-shared";

type CreateParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  onAfterCreate: (item: any) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const createItemBase = async ({
  apiInstance,
  data,
  backendRoute,
  onAfterCreate,
  handleLoading,
  handleSetAlert,
}: CreateParams) => {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  let result: boolean;
  try {
    const res = await apiInstance.post(backendRoute, data);
    onAfterCreate(res.data.data);
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
