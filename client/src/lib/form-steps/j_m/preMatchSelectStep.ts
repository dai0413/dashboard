import { API_PATHS } from "@dai0413/myorg-shared";
import {
  CreateFilterConditions,
  DataSource,
  FormStep,
  StepType,
} from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { createFilterFromParent } from "../utils/createFilterConditions/createFilterFromParent";
import { CompetitionStage } from "../../../types/models/competition-stage";
import { setTeamByCompetition } from "../utils/createFilterConditions/setTeamByCompetition";
import { Season } from "../../../types/models/season";
import { convert as createLabel } from "../../convert/CreateLabel";
import { setCompetition } from "../utils/createQuickFilterItems/setCompetition";
import { getFields } from "../models/match/fields";
import { ReadCompetitionItems } from "../types";

const readCompetitionItems: ReadCompetitionItems[] = [
  {
    key: "emperor",
    label: "天皇杯",
    params: { name: "天皇杯" },
    defaultSelect: true,
  },
  {
    key: "acl",
    label: "ACL",
    params: { name: "ACL|ACL2" },
  },
  {
    key: "full-national",
    label: "フル代表",
    params: {
      age_group: "full",
      competition_type: "national",
    },
  },
  {
    key: "national",
    label: "U代表",
    params: {
      age_group: "!full",
      competition_type: "national",
    },
  },
];

export const getPreMatchSelect = <K extends keyof FormTypeMap>(
  modelType: keyof FormTypeMap,
  matchSelect?: boolean,
): FormStep<K>[] => {
  const createFilterConditions =
    modelType === ModelType.MATCH
      ? (setTeamByCompetition as CreateFilterConditions<K>)
      : undefined;

  const base: FormStep<K>[] = [
    {
      modelType: modelType,
      stepLabel: "試合入力準備",
      type: StepType.FORM,
      dataSource: DataSource.META_DATA,
      createQuickFilterItems: (params) =>
        setCompetition({ ...params, items: readCompetitionItems }),
      skip: (_data, metaData) => metaData.competition || metaData.match,
    },
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
            params: {
              getAll: true,
              competition: metaData.competition as string,
            },
            backendRoute: API_PATHS.SEASON.ROOT,
          },
          convertValueLabel: (data: Season) =>
            createLabel(ModelType.SEASON, data),
          filterKey: "season",
          label: "シーズン",
        });
      },
      skip: (_data, metaData) => metaData.competition || metaData.match,
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
            createLabel(ModelType.COMPETITION_STAGE, data),
          filterKey: "competition-stage",
          label: "大会ステージ",
        });
      },
      skip: (_data, metaData) => metaData.season || metaData.match,
    },
    {
      modelType: modelType,
      stepLabel: "更新する試合の大会ステージを入力",
      type: StepType.FORM,
      dataSource: DataSource.META_DATA,
      fields: getFields(["competition_stage"]),
      createFilterConditions: createFilterConditions,
      skip: (_data, mataData) => mataData.competition_stage,
    },
    {
      modelType: modelType,
      stepLabel: "更新する試合のJ_M:URLを入力",
      type: StepType.FORM,
      dataSource: DataSource.META_DATA,
      fields: [
        {
          key: "getDataUrl",
          label: "データ取得url",
          fieldType: "input",
          valueType: "text",
          required: true,
        },
        {
          key: "getPositionUrl",
          label: "ポジション取得url",
          fieldType: "input",
          valueType: "text",
        },
      ],
    },
  ];

  const option: FormStep<K> = {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: modelType,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
        multi: true,
      },
    ],
  };

  const steps = matchSelect ? [...base, option] : base;

  return steps;
};
