import { AxiosInstance, AxiosResponse } from "axios";
import { AlertStatus } from "../../types/alert";
import { API_PATHS, APIError, UploadJobType } from "@dai0413/myorg-shared";

type UploadParams = {
  apiInstance: AxiosInstance;
  backendRoute: string;
  data: File;
  handleLoading?: (time: "start" | "end") => void;
  handleSetAlert?: (value: AlertStatus) => void;
  setUploadJob?: (uploadJob: UploadJobType) => void;
};

export const uploadFileBase = async ({
  apiInstance,
  data,
  backendRoute,
  handleSetAlert,
  setUploadJob,
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

    handleSetAlert?.({
      success: true,
      message: res.data?.message,
    });

    if (!res.data?.jobId) {
      throw new Error("jobId not returned");
    }
    const jobId = res.data.jobId;

    let pollingTimer: number | null = null;

    pollingTimer = window.setInterval(async () => {
      const res = await apiInstance.get(API_PATHS.UPLOAD_STATUS(jobId));
      const uploadJob: UploadJobType = res.data;

      const { status, errorCsv, totalAdded, failedCount } = uploadJob;

      setUploadJob?.(uploadJob);

      handleSetAlert?.({
        success: status === "completed",
        message: `${status} - 成功:${totalAdded} 失敗:${failedCount}`,
      });

      if (status === "completed" || status === "failed") {
        clearInterval(pollingTimer!);

        if (status === "completed" && errorCsv) {
          downloadBase64Csv(errorCsv, "failed.csv");
        }
      }
    }, 3000);

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

const downloadBase64Csv = (base64: string, filename = "failed.csv") => {
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
