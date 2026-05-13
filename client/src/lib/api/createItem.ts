import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from "@dai0413/myorg-shared";
import { CreateItemResponse } from "../../types";

type CreateParamsBase = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

type CreateParamsReturn = CreateParamsBase & {
  returnResponse: true;
};

type CreateParamsNoReturn = CreateParamsBase & {
  returnResponse?: false;
};

export function createItemBase<DATA>(
  params: CreateParamsReturn,
): Promise<CreateItemResponse<DATA>>;

export function createItemBase<DATA>(
  params: CreateParamsNoReturn,
): Promise<CreateItemResponse<DATA>>;

export async function createItemBase<DATA>({
  apiInstance,
  data,
  backendRoute,
  handleLoading,
  handleSetAlert,
  // returnResponse,
}: CreateParamsReturn | CreateParamsNoReturn): Promise<
  CreateItemResponse<DATA>
> {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  try {
    const res = await apiInstance.post(backendRoute, data);
    const responseData: CreateItemResponse<DATA> = res.data;
    alert = { success: true, message: responseData.message };

    return responseData;
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    alert = {
      success: false,
      errors: apiError.error?.errors,
      message: apiError.error?.message,
    };

    return { success: false, message: "データの追加に失敗しました" };
  } finally {
    handleSetAlert && handleSetAlert(alert);
    handleLoading && handleLoading("end");
  }
}
