import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";

type ReadItemParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  onSuccess?: (data: any) => void;

  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: ResponseStatus) => void;
  returnResponse?: boolean;
};

export const readItemBase = async ({
  apiInstance,
  backendRoute,
  onSuccess,
  handleLoading,
  handleSetAlert,
  returnResponse,
}: ReadItemParams) => {
  handleLoading && handleLoading("start");
  let alert: ResponseStatus = { success: false };
  try {
    const res = await apiInstance.get(backendRoute);
    onSuccess && onSuccess(res.data.data);
    alert = { success: true, message: res.data?.message };

    if (returnResponse) return res.data;
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
