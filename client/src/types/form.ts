import { FormTypeMap, ModelType } from "./models";
import { AlertStatus } from "./alert";
import { AxiosInstance } from "axios";
import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { OptionType } from "../utils/createOption";
import { QuickFilterItem } from "./table";
import { AddDraftData, GetDraftData } from "./form/draftData";
import { AddPostedDraftData } from "./form/postedDraftData";

export enum StepType {
  FORM = "form",
  CONFIRM = "confirm",
}

type FieldKey<T extends keyof FormTypeMap> = keyof FormTypeMap[T] | string;

export enum DataSource {
  META_DATA = "meta_data",
  BULK_COMMON = "bulk_common",
}

type FieldDefinitionBase<T extends keyof FormTypeMap> = {
  key: FieldKey<T>;
  label: string;
  required?: boolean;
  width?: string;
  multi?: boolean;
  overwriteByMany?: boolean;
  lengthInArray?: number;
  uniqueInArray?: boolean;
  dataSource?: DataSource;
};

type MultiValueField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  multi: true;
};

// <input type = "text">
type InputField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "text";
};
// <input type = "date">
type DateField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "date";
};
// <input type = "datetime-local">
type DateTimeLocalField<T extends keyof FormTypeMap> =
  FieldDefinitionBase<T> & {
    fieldType: "input";
    valueType: "datetime-local";
  };
// <input type = "number">
type NumberField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "number";
};
// <input type = "checkbox">
type CheckboxField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "input";
  valueType: "boolean";
};
// <select>
type SelectField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "select";
  valueType: "option";
};
// <table>
type TableField<T extends keyof FormTypeMap> = FieldDefinitionBase<T> & {
  fieldType: "table";
  valueType: "option";
};

// .map{<input type = "text">}
type MultiInputField<T extends keyof FormTypeMap> = MultiValueField<T> & {
  fieldType: "input";
  valueType: "text";
};
// .map {<textarea>}
type MultiTextareaField<T extends keyof FormTypeMap> = MultiValueField<T> & {
  fieldType: "textarea";
  valueType: "text";
};
// .map {<select>}
type MultiSelectField<T extends keyof FormTypeMap> = MultiValueField<T> & {
  fieldType: "select";
  valueType: "option";
};

export type FormFieldDefinition<T extends keyof FormTypeMap> =
  | InputField<T>
  | DateField<T>
  | DateTimeLocalField<T>
  | NumberField<T>
  | CheckboxField<T>
  | SelectField<T>
  | MultiInputField<T>
  | MultiTextareaField<T>
  | MultiSelectField<T>
  | TableField<T>;

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
