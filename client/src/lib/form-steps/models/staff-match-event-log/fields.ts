import {
  ArrayDataFormStep,
  FormFieldDefinition,
  StepType,
} from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";
import { combineOnChanges } from "../../utils/onChange/combine";
import { toManyOnChange } from "../../utils/onChange/toManyOnChange";
import { updatePeriodLabelFromMatch } from "../../utils/onChange/updatePeriodLabelFromMatch";
import { updateTimeName } from "../../utils/onChange/updateTimeName";
import { validateExclusiveSpecialTime } from "../../utils/validate/special_time";

type BaseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const baseModel = ModelType.STAFF_MATCH_EVENT_LOG;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  match: {
    key: "match",
    label: "試合",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  match_event_type: {
    key: "match_event_type",
    label: "イベントタイプ",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  team: {
    key: "team",
    label: "チーム",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  staff: {
    key: "staff",
    label: "スタッフ",
    fieldType: "table",
    valueType: "option",
  },
  staff_name: {
    key: "staff_name",
    label: "登録外スタッフ",
    fieldType: "input",
    valueType: "text",
  },
  time: {
    key: "time",
    label: "試合全体のうちの時間(後半 20 分は 65 と入力)",
    fieldType: "input",
    valueType: "number",
  },
  add_time: {
    key: "add_time",
    label: "追加タイム",
    fieldType: "input",
    valueType: "number",
  },
  special_time: {
    key: "special_time",
    label: "特別時間",
    fieldType: "select",
    valueType: "option",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);

export const bulkBase: ArrayDataFormStep<BaseModel> = {
  modelType: baseModel,
  stepLabel: "イベントタイプ・時間・選手を入力",
  type: StepType.FORM,
  fields: getFields([
    "match",
    "team",
    "match_event_type",
    "staff",
    "staff_name",
    "time",
    "add_time",
    "special_time",
  ]),
  many: true,
  validate: validateExclusiveSpecialTime,
  prepareNext: toManyOnChange(
    combineOnChanges(updateTimeName, updatePeriodLabelFromMatch),
  ),
};
