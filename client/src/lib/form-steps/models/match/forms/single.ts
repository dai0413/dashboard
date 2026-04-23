import { ModelType } from "../../../../../types/models";
import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { Season } from "../../../../../types/models/season";
import { CompetitionStage } from "../../../../../types/models/competition-stage";
import { getFields } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { setTeamByCompetition } from "../../../utils/createFilterConditions/setTeamByCompetition";
import { createFilterFromParent } from "../../../utils/createFilterConditions/createFilterFromParent";
import { validateStadiumEitherOne } from "../validations/stadium";
import { convert } from "../../../../convert/CreateLabel";
import { API_PATHS } from "@dai0413/myorg-shared";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

export const single: FormStep<ModelType.MATCH>[] = [
  {
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合の大会を入力",
    type: StepType.FORM,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "competition",
        label: "大会",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    createFilterConditions: async ({ metaData, api }) => {
      if (!metaData || !metaData.competition || !api) return null;
      return createFilterFromParent({
        readItemParams: {
          apiInstance: api,
          params: { competition: metaData.competition as string },
          backendRoute: API_PATHS.SEASON.ROOT,
        },
        convertValueLabel: (data: Season) => convert(ModelType.SEASON, data),
        filterKey: "season",
        label: "シーズン",
      });
    },
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合のシーズンを入力",
    type: StepType.FORM,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "season",
        label: "シーズン",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    createFilterConditions: async ({ metaData, api }) => {
      if (!metaData || !metaData.season || !api) return null;
      return createFilterFromParent({
        readItemParams: {
          apiInstance: api,
          params: { season: metaData.season as string },
          backendRoute: API_PATHS.COMPETITION_STAGE.ROOT,
        },
        convertValueLabel: (data: CompetitionStage) =>
          convert(ModelType.COMPETITION_STAGE, data),
        filterKey: "competition-stage",
        label: "大会ステージ",
      });
    },
  },
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
