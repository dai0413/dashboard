import { ConvertedDataMap, FormTypeMap } from "../types/models";
import { FormStep } from "./form";

export type ModelContext<K extends keyof FormTypeMap> = {
  items: ConvertedDataMap[K][];
  selected: ConvertedDataMap[K] | null;
  setSelected: (id: string) => void;

  formData: FormTypeMap[K];
  handleFormData: (key: keyof FormTypeMap[K], value: any) => void;
  resetFormData: () => void;

  formSteps: FormStep<K>[];

  createItem: () => void;
  readItem: (id: string) => Promise<void>;
  readItems: () => Promise<void>;
  updateItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};
