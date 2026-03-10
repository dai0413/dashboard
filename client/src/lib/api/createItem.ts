import { AxiosInstance } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from "@dai0413/myorg-shared";
import { DataResoonse } from "../../types/api";

type CreateParamsBase = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: object;
  onAfterCreate?: (item: any) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

type CreateParamsReturn = CreateParamsBase & {
  returnResponse: true;
};

type CreateParamsNoReturn = CreateParamsBase & {
  returnResponse?: false;
};

export function createItemBase(
  params: CreateParamsReturn,
): Promise<DataResoonse>;

export function createItemBase(params: CreateParamsNoReturn): Promise<boolean>;

export async function createItemBase({
  apiInstance,
  data,
  backendRoute,
  onAfterCreate,
  handleLoading,
  handleSetAlert,
  returnResponse,
}: CreateParamsReturn | CreateParamsNoReturn): Promise<boolean | DataResoonse> {
  handleLoading && handleLoading("start");
  let alert: AlertStatus = { success: false };
  let result: boolean;
  try {
    const res = await apiInstance.post(backendRoute, data);
    onAfterCreate?.(res.data.data);
    alert = { success: true, message: res.data?.message };
    result = true;

    if (returnResponse) return res.data as DataResoonse;
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

  if (returnResponse)
    return {
      data: [],
      totalCount: 0,
      page: 0,
      pageSize: 0,
    };

  return result;
}
