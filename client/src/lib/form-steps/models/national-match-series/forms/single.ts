import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { setMatchs } from "../utils/createQuickFilterItems/setMatchs";
import { setTeam } from "../utils/createQuickFilterItems/setTeam";

type BaseModel = ModelType.NATIONAL_MATCH_SERIES;
const baseModel = ModelType.NATIONAL_MATCH_SERIES;

export const single: FormStep<ModelType.NATIONAL_MATCH_SERIES>[] = [
  {
    stepLabel: "名称入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name"]),
  },
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
    fields: getFields(["team"]),
  },
  // {
  //   stepLabel: "国を選択",
  //   type: StepType.FORM,
  //   modelType: baseModel,
  //   fields: getFields(["country"]),
  // },
  // {
  //   stepLabel: "年代を選択",
  //   type: StepType.FORM,
  //   modelType: baseModel,
  //   fields: getFields(["age_group"]),
  // },
  {
    stepLabel: "日付",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["joined_at", "left_at"]),
    createQuickFilterItems: (args) => setMatchs(args.data, args.api),
  },
  {
    stepLabel: "試合",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["matches"]),
  },
  {
    stepLabel: "url",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["urls"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
