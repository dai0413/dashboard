import { AxiosInstance, AxiosResponse } from "axios";
import { AlertStatus } from "../../types/alert";
import { APIError } from "@dai0413/myorg-shared";

type UploadParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: File;
  onAfterUpload: (item: any) => void;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
};

export const uploadFileBase = async ({
  apiInstance,
  data,
  backendRoute,
  onAfterUpload,
  handleSetAlert,
}: UploadParams): Promise<AxiosResponse | undefined> => {
  handleSetAlert?.({
    success: false,
    message: "データ送信中",
  });

  const formData = new FormData();
  formData.append("file", data);

  try {
    const res = await apiInstance.post(backendRoute, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ 200 OK のときだけ items を反映
    if (res.status === 200 && res.data?.data) {
      onAfterUpload(res.data.data);
    }

    // ✅ 206 PARTIAL_CONTENT
    if (res.status === 206 && res.data?.csv) {
      downloadBase64Csv(res.data.csv, res.data.filename);

      handleSetAlert?.({
        success: false,
        message: res.data.message,
      });

      return res;
    }

    handleSetAlert?.({
      success: true,
      message: res.data?.message,
    });

    return res;
  } catch (err: any) {
    const apiError = err.response?.data as APIError;

    handleSetAlert?.({
      success: false,
      errors: apiError?.error?.errors,
      message: apiError?.error?.message,
    });

    return undefined;
  }
};

const downloadBase64Csv = (base64: string, filename: string) => {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
