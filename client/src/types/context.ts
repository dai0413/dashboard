import { GettedModelDataMap, FormTypeMap } from "../types/models";
import { FormStep } from "./form";

export type ModelContext<K extends keyof FormTypeMap> = {
  items: GettedModelDataMap[K][];
  selected: GettedModelDataMap[K] | null;
  setSelected: (id: string) => void;

  formData: FormTypeMap[K];
  handleFormData: (key: keyof FormTypeMap[K], value: any) => void;
  resetFormData: () => void;

  formSteps: FormStep<K>[];

  startNewData: (item?: FormTypeMap[K]) => void;
  startEdit: (item?: GettedModelDataMap[K]) => void;

  createItem: () => void;
  readItem: (id: string) => Promise<void>;
  readItems: (limit?: number, player?: string) => Promise<void>;
  updateItem: (data: FormTypeMap[K]) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  uploadFile?: (file: File) => Promise<void>;
  downloadFile?: () => Promise<void>;

  getDiffKeys: () => string[];
  isLoading: boolean;
};
