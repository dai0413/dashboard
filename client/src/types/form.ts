import { FormTypeMap, ModelType } from "./models";
import { AlertStatus } from "./alert";
import { AxiosInstance } from "axios";
import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { OptionType } from "../utils/createOption";
import { QuickFilterItem } from "./table";
import { AddDraftData, GetDraftData } from "./form/draftData";
import { AddPostedDraftData } from "./form/postedDraftData";
import { FormFieldDefinition } from "./form/field";

export enum StepType {
  FORM = "form",
  CONFIRM = "confirm",
}

export enum DataSource {
  META_DATA = "meta_data",
  BULK_COMMON = "bulk_common",
}

export type FormUpdatePair = {
  key: string;
  value: any;
}[];

type CreateFilterConditions<K extends keyof FormTypeMap> = (args: {
  data?: FormTypeMap[K];
  metaData?: Record<string, any>;
  api?: AxiosInstance;
}) => Promise<FilterConditionsByKey | null>;

type CreateQuickFilterItems<K extends keyof FormTypeMap> = (args: {
  data?: FormTypeMap[K];
  metaData?: Record<string, any>;
  api?: AxiosInstance;
}) => Promise<QuickFilterItemsByKey | null>;

type BaseFormStep<K extends keyof FormTypeMap> = {
  modelType: ModelType;
  stepLabel: string;
  type: StepType;
  fields?: FormFieldDefinition<K>[];
  skip?: (data: FormTypeMap[K]) => boolean;
  validate?: (data: FormTypeMap[K]) => AlertStatus;
  onChange?:
    | ((data: FormTypeMap[K], api: AxiosInstance) => Promise<FormUpdatePair>)
    | ((data: FormTypeMap[K]) => FormUpdatePair);
  createFilterConditions?: CreateFilterConditions<K>;
  createQuickFilterItems?: CreateQuickFilterItems<K>;
  addDraftData?: AddDraftData<K>;
  addPostedDraftData?: AddPostedDraftData;
};

type ArrayDataFormStep<K extends keyof FormTypeMap> = BaseFormStep<K> & {
  many: true;
  fetchValue?: (
    data?: FormTypeMap[K],
    api?: AxiosInstance,
  ) => Promise<FormTypeMap[K][]>;
  getDraftData?: GetDraftData<K, true>;
};

type RecordDataFormStep<K extends keyof FormTypeMap> = BaseFormStep<K> & {
  many?: false;
  getDraftData?: GetDraftData<K, false>;
};

export type FormStep<K extends keyof FormTypeMap> =
  | ArrayDataFormStep<K>
  | RecordDataFormStep<K>;

export type FilterConditionsByKey = Partial<
  Record<ModelType | OptionType, FilterableFieldDefinition[]>
>;

export type QuickFilterItemsByKey = Partial<
  Record<ModelType | OptionType, QuickFilterItem[]>
>;
