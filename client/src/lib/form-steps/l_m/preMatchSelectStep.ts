import { API_PATHS } from "@dai0413/myorg-shared";
import { DataSource, FormStep, StepType } from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { Match } from "../../../types/models/match";
import { createFilterFromParent } from "../utils/createFilterConditions/createFilterFromParent";
import { Season } from "../../../types/models/season";
import { convert } from "../../convert/CreateLabel";
import { CompetitionStage } from "../../../types/models/competition-stage";

export const getPreMatchSelect = <K extends keyof FormTypeMap>(
  modelType: keyof FormTypeMap,
): FormStep<K>[] => [
  {
    modelType: modelType,
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
          params: { getAll: true, competition: metaData.competition as string },
          backendRoute: API_PATHS.SEASON.ROOT,
        },
        convertValueLabel: (data: Season) => convert(ModelType.SEASON, data),
        filterKey: "season",
        label: "シーズン",
      });
    },
    skip: (data, metaData) => {
      if ("match" in data || "match" in metaData) return true;

      return false;
    },
  },
  {
    modelType: modelType,
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
          params: { getAll: true, season: metaData.season as string },
          backendRoute: API_PATHS.COMPETITION_STAGE.ROOT,
        },
        convertValueLabel: (data: CompetitionStage) =>
          convert(ModelType.COMPETITION_STAGE, data),
        filterKey: "competition-stage",
        label: "大会ステージ",
      });
    },
    skip: (data, metaData) => {
      if ("match" in data || "match" in metaData) return true;

      return false;
    },
  },
  {
    stepLabel: "大会ステージを選択",
    type: StepType.FORM,
    modelType: modelType,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "competition_stage",
        label: "大会ステージ",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "match_week",
        label: "節",
        fieldType: "input",
        valueType: "number",
      },
    ],
    createFilterConditions: async ({ metaData, api }) => {
      if (!metaData || !metaData.competition || !api) return null;
      let params: {
        getAll: true;
        season?: string;
        match_week?: string;
      } = { getAll: true };
      if (metaData.season) params.season = metaData.season;
      if (metaData.match_week) params.match_week = metaData.match_week;
      return createFilterFromParent({
        readItemParams: {
          apiInstance: api,
          params: params,
          backendRoute: API_PATHS.MATCH.ROOT,
        },
        convertValueLabel: (data: Match) => convert(ModelType.MATCH, data),
        filterKey: "match",
        label: "試合",
      });
    },
    skip: (data, metaData) => {
      if ("match" in data || "match" in metaData) return true;

      return false;
    },
  },
];
