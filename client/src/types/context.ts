import { GettedModelDataMap, FormTypeMap, ModelDataMap } from "../types/models";
import { ReadItemsParamsMap } from "./api";
import { FilterableFieldDefinition, SortableFieldDefinition } from "./field";

export type ModelContext<K extends keyof FormTypeMap> = {
  metacrud: MetaCrudContext<K>;
};

// CRUD 操作& メタ情報
export type MetaCrudContext<K extends keyof FormTypeMap> = {
  items: GettedModelDataMap[K][];
  selected: GettedModelDataMap[K] | null;
  setSelected: (id: string) => void;

  readItem: (id: string) => Promise<void>;
  readItems: (
    params: ReadItemsParamsMap[K],
    onSuccess?: (items?: ModelDataMap[K][]) => void
  ) => Promise<void>;

  createItem: (formData: FormTypeMap[K]) => Promise<void>;
  createItems: (formDatas: FormTypeMap[K][]) => Promise<void>;

  updateItem: (data: FormTypeMap[K]) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  uploadFile?: (file: File) => Promise<void>;
  downloadFile?: () => Promise<void>;

  isLoading: boolean;
  filterableField: FilterableFieldDefinition[];
  sortableField: SortableFieldDefinition[];
};
