import {
  FilterableFieldDefinition,
  QueryParams,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { GettedModelDataMap, FormTypeMap, ModelType } from "../types/models";

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
