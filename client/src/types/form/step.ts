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

type BaseFormStep<K extends keyof FormTypeMap> = {
  modelType: ModelType;
  stepLabel: string;
  type: StepType;
  fields?: FormFieldDefinition<K>[];
  validate?: (data: FormTypeMap[K]) => AlertStatus;
  createFilterConditions?: CreateFilterConditions<K>;
  createQuickFilterItems?: CreateQuickFilterItems<K>;
  addDraftData?: AddDraftData<K>;
  addPostedDraftData?: AddPostedDraftData;
  addOptions?: AddOptions<K>;
};

type ArrayDataFormStep<K extends keyof FormTypeMap> = BaseFormStep<K> & {
  many: true;
  fetchValue?: (
    data?: FormTypeMap[K],
    api?: AxiosInstance,
  ) => Promise<FormTypeMap[K][]>;
  getDraftData?: GetDraftData<K, true>;
  onChange?: OnChange<K, true>;
};

type RecordDataFormStep<K extends keyof FormTypeMap> = BaseFormStep<K> & {
  many?: false;
  dataSource?: DataSource;
  skip?: (data: FormTypeMap[K], metaData: Record<string, any>) => boolean;
  getDraftData?: GetDraftData<K, false>;
  onChange?: OnChange<K, false>;
};

export type FormStep<K extends keyof FormTypeMap> =
  | ArrayDataFormStep<K>
  | RecordDataFormStep<K>;
