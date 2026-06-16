import { AxiosInstance } from "axios";
import { AlertStatus } from "../alert";
import { FormTypeMap, ModelType } from "../models";
import { FormFieldDefinition } from "./field";
import { AddDraftData, GetDraftData } from "./draftData";
import { AddPostedDraftData } from "./postedDraftData";
import { CreateFilterConditions } from "./filter";
import { CreateQuickFilterItems } from "./quickFilter";
import { OnChange } from "./onChange";
import { DataSource, StepType } from "./common";
import { AddOptions } from "./option";
import { FieldCopy } from "./fieldCopy";

type BaseFormStep<K extends keyof FormTypeMap> = {
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

export type ArrayDataFormStep<K extends keyof FormTypeMap> = BaseFormStep<K> & {
  many: true;
  fetchValue?: (
    data?: FormTypeMap[K],
    api?: AxiosInstance,
  ) => Promise<FormTypeMap[K][]>;
  getDraftData?: GetDraftData<K, true>;
  onChange?: OnChange<FormTypeMap[K], true>; //自動実行　更新フィールドのみ返す
  autoFill?: OnChange<FormTypeMap[K], true>; //ボタンクリック　すべてのフィールド返す

  fieldCopy?: FieldCopy<K>;
};

export type RecordDataFormStep<K extends keyof FormTypeMap> =
  BaseFormStep<K> & {
    many?: false;
    dataSource?: DataSource;
    skip?: (data: FormTypeMap[K], metaData: Record<string, any>) => boolean;
    getDraftData?: GetDraftData<K, false>;
    onChange?: OnChange<FormTypeMap[K], false>;
  };

export type FormStep<K extends keyof FormTypeMap> =
  | ArrayDataFormStep<K>
  | RecordDataFormStep<K>;
