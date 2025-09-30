import { AxiosInstance } from "axios";
import { APIError, ResponseStatus } from "../../types/api";

type UploadParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: File;
  onAfterUpload: (item: any) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: ResponseStatus) => void;
};

export const uploadFileBase = async ({
  apiInstance,
  data,
  backendRoute,
  onAfterUpload,
  handleSetAlert,
}: UploadParams) => {
  handleSetAlert &&
    handleSetAlert({
      success: false,
      message: "データ送信中",
    });
  let result: boolean;
  let alert: ResponseStatus = { success: false };
  const formData = new FormData();
  formData.append("file", data);

  try {
    const res = await apiInstance.post(backendRoute, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data && res.data.data) {
      onAfterUpload(res.data.data);
    }
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
  }

  return result;
};
