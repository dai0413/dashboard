import {
  DataSource,
  FormFieldDefinition,
  FormStep,
  StepType,
} from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createFieldHelpers } from "../../core/createFieldHelpers";
import {
  applyPositions,
  readL_MPosition,
  readSN_MPosition,
} from "./utils/applyPosition";
import { validatePlayerEitherOne } from "./validations/name";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  match: {
    key: "match",
    label: "試合",
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
  player: {
    key: "player",
    label: "選手",
    fieldType: "table",
    valueType: "option",
  },
  player_name: {
    key: "player_name",
    label: "登録外選手",
    fieldType: "input",
    valueType: "text",
  },
  number: {
    key: "number",
    label: "背番号",
    fieldType: "input",
    valueType: "number",
  },
  play_status: {
    key: "play_status",
    label: "ステータス",
    fieldType: "select",
    valueType: "option",
  },
  position: {
    key: "position",
    label: "ポジション",
    fieldType: "select",
    valueType: "option",
  },
  time: {
    key: "time",
    label: "プレイ時間",
    fieldType: "input",
    valueType: "number",
  },
};

export const { getFields } = createFieldHelpers<BaseModel, Key>(fieldMap);

export const bulkBase: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "更新する試合のJ_M:URLを入力",
    type: StepType.FORM,
    many: false,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "getDataUrl",
        label: "データ取得url",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "getPositionUrl",
        label: "ポジション取得url",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    modelType: baseModel,
    stepLabel: "背番号・ステータス・ポジション・プレイ時間を入力",
    type: StepType.FORM,
    fields: getFields([
      "match",
      "team",
      "player",
      "player_name",
      "number",
      "play_status",
      "position",
      "time",
    ]),
    many: true,
    validate: validatePlayerEitherOne,
    actions: [
      {
        label: "L_Mから計算",
        onClick: async ({ formDatas, formLabels, api }) => {
          return applyPositions(api, formDatas, formLabels, readL_MPosition);
        },
      },
      {
        label: "SN_Mから計算",
        onClick: async ({ metaData, formDatas, formLabels, api }) => {
          if (!metaData.getPositionUrl) {
            return { formDatas, formLabels };
          }

          return applyPositions(
            api,
            formDatas,
            formLabels,
            readSN_MPosition(metaData.getPositionUrl),
          );
        },
      },
    ],
  },
];
