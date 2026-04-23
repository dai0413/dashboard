import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setTeamByCompetition } from "../../../utils/createFilterConditions/setTeamByCompetition";
import { getFields } from "../fields";
import { validateStadiumEitherOne } from "../validations/stadium";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

export const single: FormStep<ModelType.MATCH>[] = [
  {
    stepLabel: "大会ステージを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["competition_stage"]),
    createFilterConditions: setTeamByCompetition,
  },
  {
    stepLabel: "ホームチームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["home_team"]),
  },
  {
    stepLabel: "アウェイチームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["away_team"]),
  },
  {
    stepLabel: "スタジアムを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["stadium", "stadium_name"]),
    validate: validateStadiumEitherOne,
  },
  {
    stepLabel: "試合形式を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match_format"]),
  },
  {
    stepLabel: "節・日付・観客数を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match_week", "date", "audience"]),
  },
  {
    stepLabel: "得点",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "home_goal",
      "away_goal",
      "home_pk_goal",
      "away_pk_goal",
    ]),
  },
  {
    stepLabel: "気象条件を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["weather", "temperature", "humidity"]),
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["transferurl", "sofaurl", "urls"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
