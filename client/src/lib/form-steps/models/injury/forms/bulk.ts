import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { toManyOnChange } from "../../../utils/onChange/toManyOnChange";
import { updateTeam } from "../onChanges/updateTeam";

type BaseModel = ModelType.INJURY;
const baseModel = ModelType.INJURY;

export const bulk: FormStep<ModelType.INJURY>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: [
      {
        key: "doa",
        label: "発表日",
        fieldType: "input",
        valueType: "date",
      },
    ],
  },
  {
    stepLabel: "選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "doa",
        label: "発表日",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "doi",
        label: "負傷日",
        fieldType: "input",
        valueType: "date",
      },
      { key: "dos", label: "手術日", fieldType: "input", valueType: "date" },
      {
        key: "injured_part",
        label: "負傷箇所・診断結果",
        fieldType: "input",
        valueType: "text",
        multi: true,
      },
      {
        key: "ttp",
        label: "全治期間",
        fieldType: "input",
        valueType: "text",
        multi: true,
      },
      {
        key: "URL",
        label: "URL",
        fieldType: "textarea",
        valueType: "text",
        multi: true,
      },
    ],
    many: true,
    onChange: toManyOnChange(updateTeam),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
