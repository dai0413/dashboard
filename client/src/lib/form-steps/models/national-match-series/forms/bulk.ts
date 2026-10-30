import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { setTeam } from "../utils/createQuickFilterItems/setTeam";

type BaseModel = ModelType.NATIONAL_MATCH_SERIES;
const baseModel = ModelType.NATIONAL_MATCH_SERIES;

export const bulk: FormStep<BaseModel>[] = [
  {
    stepLabel: "国選択",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "country",
        label: "国",
        fieldType: "table",
        valueType: "option",
      },
    ],
    createQuickFilterItems: (args) => setTeam(args.metaData, args.api),
    skip: (data) => !!data.team,
  },
  {
    stepLabel: "チーム",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "データ入力",
    type: StepType.FORM,
    modelType: baseModel,
    many: true,
    fields: getFields([
      "team",
      "name",
      "joined_at",
      "left_at",
      "matches",
      "urls",
    ]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
