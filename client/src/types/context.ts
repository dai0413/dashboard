import {
  GettedModelDataMap,
  FormTypeMap,
  ModelDataMap,
  ModelType,
} from "../types/models";
import { ReadItemsParamsMap } from "./api";
import { FilterableFieldDefinition, SortableFieldDefinition } from "./field";

export type ModelContext<K extends ModelType> = {
  metacrud: MetaCrudContext<K>;
};

// CRUD 操作& メタ情報
export type MetaCrudContext<K extends ModelType> = {
  items: GettedModelDataMap[K][];
  selected: GettedModelDataMap[K] | null;
  setSelected: (id: string) => void;

  readItem: (id: string) => Promise<void>;
  readItems: (
    params: ReadItemsParamsMap[K],
    onSuccess?: (items?: ModelDataMap[K][]) => void
  ) => Promise<void>;

  createItem: (formData: FormTypeMap[K]) => Promise<boolean>;
  createItems: (formDatas: FormTypeMap[K][]) => Promise<boolean>;

  updateItem: (data: FormTypeMap[K]) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  uploadFile?: (file: File) => Promise<boolean>;
  downloadFile?: () => Promise<boolean>;

  isLoading: boolean;
  filterableField: FilterableFieldDefinition[];
  sortableField: SortableFieldDefinition[];
};
