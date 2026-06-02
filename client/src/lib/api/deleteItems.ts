import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError, DeleteItemsResponse } from "@dai0413/myorg-shared";

type UpdateParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const deleteItemsBase = async <DATA>({
  apiInstance,
  data,
  backendRoute,
  handleLoading,
  handleSetAlert,
}: UpdateParams): Promise<boolean> => {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.delete(backendRoute, { data });
    const responseData: DeleteItemsResponse<DATA> = res.data;
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
    console.log("alert", alert);
    handleSetAlert && handleSetAlert(alert);
    handleLoading && handleLoading("end");
  }
};
