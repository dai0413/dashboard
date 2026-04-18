import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.COMPETITION_STAGE;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  season: {
    key: "season",
    label: "シーズン",
    fieldType: "table",
    valueType: "option",
    required: true,
  },
  stage_type: {
    key: "stage_type",
    label: "ステージタイプを選択",
    fieldType: "select",
    valueType: "option",
    required: true,
  },
  name: {
    key: "name",
    label: "名前を入力  （準決勝, 決勝, グループステージ A)",
    fieldType: "input",
    valueType: "text",
  },
  round_number: {
    key: "round_number",
    label: "ラウンド (1=1 回戦, 2=2 回戦)",
    fieldType: "input",
    valueType: "number",
  },
  leg: {
    key: "leg",
    label: "2試合合計制など (1=1st, 2=2nd)",
    fieldType: "input",
    valueType: "number",
  },
  order: {
    key: "order",
    label: "並び順",
    fieldType: "input",
    valueType: "number",
  },
  parent_stage: {
    key: "parent_stage",
    label: "親要素",
    fieldType: "select",
    valueType: "option",
  },
  notes: {
    key: "notes",
    label: "メモ",
    fieldType: "input",
    valueType: "text",
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
