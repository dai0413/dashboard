import { AxiosInstance } from "axios";
import { createItemBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { DraftDataValue } from "../../../../types/form";

export const fetchResolved = async <
  TModel extends keyof DraftDataValue,
  TInput,
  TOutput,
>(
  api: AxiosInstance,
  modelName: TModel,
  input: TInput[],
): Promise<TOutput[]> => {
  const data = {
    [modelName]: input,
  } as Record<TModel, TInput[]>;

  const res = await createItemBase<Record<TModel, TOutput[]>>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data,
    returnResponse: true,
  });

  if (!res.success) return [];

  return res.data[modelName];
};
