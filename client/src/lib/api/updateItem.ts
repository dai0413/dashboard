import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from "@dai0413/myorg-shared";
import { UpdateItemResponse } from "../../types";

type UpdateParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const updateItemBase = async <DATA>({
  apiInstance,
  data,
  backendRoute,
  handleLoading,
  handleSetAlert,
}: UpdateParams): Promise<boolean> => {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.patch(backendRoute, data);
    const responseData: UpdateItemResponse<DATA> = res.data;
    alert = { success: true, message: responseData.message };

    return true;
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    alert = {
      success: false,
      errors: apiError.error?.errors,
      message: apiError.error?.message,
    };

    return false;
  } finally {
    handleSetAlert && handleSetAlert(alert);
    handleLoading && handleLoading("end");
  }
};
