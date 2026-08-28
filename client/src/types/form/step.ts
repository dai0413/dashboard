import { AxiosInstance } from "axios";
import { AlertStatus } from "../alert";
import { FormTypeMap, ModelType } from "../models";
import { FormFieldDefinition } from "./field";
import { AddDraftData, DraftData, GetDraftData } from "./draftData";
import { AddPostedDraftData, PostedDraftData } from "./postedDraftData";
import { CreateFilterConditions, FilterConditionsByKey } from "./filter";
import { CreateQuickFilterItems, QuickFilterItemsByKey } from "./quickFilter";
import { OnChange } from "./onChange";
import { DataSource, StepType } from "./common";
import { AddOptions, OptionObj } from "./option";
import { FieldCopy } from "./fieldCopy";
import { FormMode } from "../types";
import { UpdateData } from "./update";
import { PrepareUpdateData } from "./prepareUpdateData";

type noChangeFormStep = {
  nextFormMode?: FormMode.CREATE;
};

type ChangeToCreateFormStep = {
  nextFormMode: FormMode.CREATE;
};

type ChangeToUpdateFormStep<K extends keyof FormTypeMap, T extends boolean> = {
  nextFormMode: FormMode.UPDATE;
  prepareUpdateData?: PrepareUpdateData<FormTypeMap[K], T>;
};

type FormModeStep<K extends keyof FormTypeMap, T extends boolean> =
  | noChangeFormStep
  | ChangeToCreateFormStep
  | ChangeToUpdateFormStep<K, T>;

type BaseFormStep<
  K extends keyof FormTypeMap,
  T extends boolean,
> = FormModeStep<K, T> & {
  modelType: ModelType;
  stepLabel: string;
  type: StepType;
  fields?: FormFieldDefinition<K>[];
  validate?: (
    data: FormTypeMap[K],
    formLabel?: Record<string, any>,
  ) => AlertStatus;
  createFilterConditions?: CreateFilterConditions<K>;
  createQuickFilterItems?: CreateQuickFilterItems<K>;
  addDraftData?: AddDraftData<K>;
  addPostedDraftData?: AddPostedDraftData;
  addOptions?: AddOptions<K>;
};

export type ArrayDataFormStep<K extends keyof FormTypeMap> = BaseFormStep<
  K,
  true
> & {
  many: true;
  fetchValue?: (
    data?: FormTypeMap[K],
    api?: AxiosInstance,
  ) => Promise<FormTypeMap[K][]>;
  getDraftData?: GetDraftData<K, true>;
  prepareNext?: OnChange<FormTypeMap[K], true>;
  actions?: {
    label: string;
    onClick: OnChange<FormTypeMap[K], true>;
  }[];
  fieldCopy?: FieldCopy<K>;
};

export type RecordDataFormStep<K extends keyof FormTypeMap> = BaseFormStep<
  K,
  false
> & {
  many?: false;
  dataSource?: DataSource;
  skip?: (data: FormTypeMap[K], metaData: Record<string, any>) => boolean;
  getDraftData?: GetDraftData<K, false>;
  prepareNext?: OnChange<FormTypeMap[K], false>;
  actions?: {
    label: string;
    onClick: OnChange<FormTypeMap[K], false>;
  }[];
};

export type FormStep<K extends keyof FormTypeMap> =
  | ArrayDataFormStep<K>
  | RecordDataFormStep<K>;

export type FormState<T extends keyof FormTypeMap> = {
  formData: FormTypeMap[T];
  formLabel: Record<string, any>;
  bulkCommonData: FormTypeMap[T];
  bulkCommonLabel: Record<string, any>;
  formDatas: FormTypeMap[T][];
  formLabels: Record<string, any>[];
  metaData: Record<string, any>;
  metaDataLabel: Record<string, any>;
  metaDatas: Record<string, any>[];
  metaDataLabels: Record<string, any>[];
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  originalData: UpdateData<FormTypeMap[T]> | null;
  originalDatas: UpdateData<FormTypeMap[T]>[];
};

export type ApplyStateValue<T extends keyof FormTypeMap> = {
  values: FormState<T>;
  options: Record<string, OptionObj<any>>;
  filterConditionsObj: FilterConditionsByKey | null;
  quickFilterItemsObj: QuickFilterItemsByKey | null;
};
