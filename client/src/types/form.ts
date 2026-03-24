import { FormTypeMap, ModelType } from "./models";
import { AlertStatus } from "./alert";
import { AxiosInstance } from "axios";
import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { Form } from "@dai0413/myorg-shared/types/j_m/values";
import { OptionType } from "../utils/createOption";
import { QuickFilterItem } from "./table";
import { DataResoonse } from "./api";
import { MatchGet } from "./models/match";
import { PlayerAppearanceGet } from "./models/player-appearance";
import { PlayerMatchEventLogGet } from "./models/player-match-event-log";
import { StaffAppearanceGet } from "./models/staff-appearance";
import { RefereeAppearanceGet } from "./models/referee-appearance";
import { MatchFormatGet } from "./models/match-format";
import { TeamMatchFormationForm } from "./models/team-match-formation";
import { Label } from "./types";

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

type AddDraftData<K extends keyof FormTypeMap> = (args: {
  data?: FormTypeMap[K] & Record<string, any>;
  metaData?: Record<string, any>;
  draftData?: DraftData;
  postedDraftData?: PostedDraftData;
  api?: AxiosInstance;
}) => Promise<DraftData>;

export type AddPostedDraftData = (args: {
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  metaData: Record<string, any>;
  res: DataResoonse;
}) => PostedDraftData;

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

type GetDraftData<K extends keyof FormTypeMap, T extends boolean> = (args: {
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  metaData: Record<string, any>;
}) => T extends true
  ? { value: FormTypeMap[K][]; label: Record<string, any>[] }
  : { value: FormTypeMap[K]; label: Record<string, any> };

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

type TeamMatchFormation = Omit<TeamMatchFormationForm, "formation"> & {
  formation?: Label;
};

type DraftDataValue = Form & {
  teamMatchFormation?: {
    home: TeamMatchFormation;
    away: TeamMatchFormation;
  };
};

export type DraftData = Record<string, DraftDataValue>;
export type PostedDraftData = Record<string, PostedDraftDataValues>;

type PostedDraftDataValues = {
  matchLabel?: string;
  periods?: MatchFormatGet["period"];
  match: MatchGet;
  playerAppearance: {
    home: PlayerAppearanceGet[];
    away: PlayerAppearanceGet[];
  };
  playerMatchEventLog: {
    home: PlayerMatchEventLogGet[];
    away: PlayerMatchEventLogGet[];
  };
  staffAppearance: {
    home: StaffAppearanceGet[];
    away: StaffAppearanceGet[];
  };
  refereeAppearance: {
    home: RefereeAppearanceGet[];
    away: RefereeAppearanceGet[];
  };
};
