import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import {
  APIError,
  CreateItemResponse,
  UpdateItemsResponse,
} from "@dai0413/myorg-shared";

type UpdateParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const updateItemsBase = async <DATA>({
  apiInstance,
  data,
  backendRoute,
  handleLoading,
  handleSetAlert,
}: UpdateParams): Promise<CreateItemResponse<DATA[]>> => {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.patch(backendRoute, data);
    const responseData: UpdateItemsResponse<DATA[], DATA[]> = res.data;
    alert = { success: true, message: responseData.message };

    return {
      success: true,
      data: responseData.data,
      message: responseData.message,
    };
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    alert = {
      success: false,
      errors: apiError.error?.errors,
      message: apiError.error?.message,
    };

    return {
      success: false,
      message: "データの更新に失敗しました",
      error: apiError.error.message,
    };
  } finally {
    handleSetAlert && handleSetAlert(alert);
    handleLoading && handleLoading("end");
  }
};
