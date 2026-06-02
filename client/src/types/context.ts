import { QueryParams, UploadJobType } from "@dai0413/myorg-shared";
import { GettedModelDataMap, FormTypeMap, ModelType } from "../types/models";
import { AxiosResponse } from "axios";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { UpdateData } from "./form";

export type ModelContext<K extends ModelType> = {
  metacrud: MetaCrudContext<K>;
};

// CRUD 操作& メタ情報
export type MetaCrudContext<K extends ModelType> = {
  items: GettedModelDataMap[K][];
  totalCount: number;
  page: number;
  pageSize: number;
  selected: GettedModelDataMap[K] | null;
  setSelected: (id: string) => void;

  readItem: (id: string) => Promise<void>;
  readItems: (params: QueryParams) => Promise<void>;

  createItem: (
    formData: FormTypeMap[K],
  ) => Promise<CreateItemResponse<FormTypeMap[K]>>;
  createItems: (
    formDatas: FormTypeMap[K][],
  ) => Promise<CreateItemResponse<FormTypeMap[K][]>>;

  updateItem: (id: string, data: FormTypeMap[K]) => Promise<boolean>;
  updateItems: (data: UpdateData<K>[]) => Promise<boolean>;

  deleteItem: (id: string) => Promise<boolean>;
  deleteItems: (data: GettedModelDataMap[K][]) => Promise<boolean>;

  uploadFile?: (file: File) => Promise<AxiosResponse<any, any, {}> | undefined>;
  downloadFile?: () => Promise<boolean>;

  resetItems: () => void;
  isLoading: boolean;

  uploadJob: UploadJobType | null;
};
