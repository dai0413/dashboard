import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { Scraped as MatchScraped } from "@dai0413/myorg-shared/types/get-new-data/models/match";
import { Scraped as CardIdScraped } from "@dai0413/myorg-shared/types/get-new-data/site/d_ml/cardId";

import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { createItemBase } from "../../../../api";
import { AxiosInstance } from "axios";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { DraftData, DraftDataValue } from "../../../../../types/form/draftData";
import { getFields } from "../fields";
import { validateStadiumEitherOne } from "../validations/stadium";
import { createFilterFromParent } from "../../../utils/createFilterConditions/createFilterFromParent";
import { CompetitionStage } from "../../../../../types/models/competition-stage";
import { convert } from "../../../../convert/CreateLabel";
import { setTeamByCompetition } from "../../../utils/createFilterConditions/setTeamByCompetition";
import { Season } from "../../../../../types/models/season";
import { CardIdOption } from "../../../../../utils/createOption/custom/cardId";
import { optionFieldDefinition } from "../../../../model-fields";
import { CustomOptionType } from "../../../../../utils/createOption/types/base";

const KEYS = [
  "home_team",
  "away_team",
  "stadium",
  "match_format",
  "competition_stage",
] as const;

type Input = ResolveInput<{
  competition: Select.MODEL;
  home_team: Select.MODEL;
  away_team: Select.MODEL;
  match_format: Select.MODEL;
  stadium: Select.MODEL;
}>[];

const fetchResolved = async (
  api: AxiosInstance,
  input: Input,
): Promise<ResolveOutput[]> => {
  const res = await createItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { match: input },
    returnResponse: true,
  });

  if (!res?.data || !Array.isArray(res.data.match)) return [];

  return res.data.match;
};

const resolve = async (api: AxiosInstance, data: MatchScraped[]) => {
  const input: Input = data;
  return fetchResolved(api, input);
};

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

export const match: FormStep<ModelType.MATCH>[] = [
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
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合の大会ステージを入力",
    type: StepType.FORM,
    fields: getFields(["competition_stage"]),
    createFilterConditions: setTeamByCompetition,
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合一覧URLを入力",
    type: StepType.FORM,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "url",
        label: "URL",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
    ],
    addOptions: async ({ metaData, api }) => {
      const { url } = metaData;
      if (!url) return {};

      const res = await createItemBase({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_ML.CARD_IDS,
        data: { url },
        returnResponse: true,
      });

      if (!res?.data) return {};

      const optionsData: CardIdScraped[] = res.data;

      const data: CardIdOption[] = optionsData
        .map((s, i) => {
          return {
            ...s,
            label: `${s.season}-${s.competition}-${i}`,
            key: s.match_card_id,
          };
        })
        .filter((o): o is CardIdOption => o.key !== undefined);

      const fields = optionFieldDefinition[CustomOptionType.CARD_IDS];

      const options = {
        card_ids: { data, fields },
      };

      return options;
    },
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合を選択",
    type: StepType.FORM,
    dataSource: DataSource.META_DATA,
    fields: [
      {
        key: "card_ids",
        label: "MATCH",
        fieldType: "table",
        valueType: "option",
        required: true,
        multi: true,
      },
    ],
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "J_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ data, metaData, api, formLabel }) => {
      const id = metaData?.card_ids;

      if (!api || !id) return {};

      const res = await createItemBase({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_ML.CARD_IDS,
        data: { id },
        returnResponse: true,
      });

      if (!res?.data) return {};

      const draftDataValue: DraftData = res.data;

      const applyCompetitionStage = (item: DraftDataValue) => {
        return {
          ...item,
          match: {
            ...item.match,
            competition_stage: {
              id: data.match?.competition_stage,
              label: formLabel.competition_stage,
            },
          },
        };
      };

      const nextData: DraftData = Object.fromEntries(
        Object.entries(draftDataValue).map(([key, value]) => [
          key,
          applyCompetitionStage(value),
        ]),
      );

      return nextData;
    },
    getDraftData: async ({ draftData, api }) => {
      const matchData: MatchScraped[] = Object.values(draftData)
        .flatMap((v) => v.match)
        .filter((v): v is MatchScraped => v !== undefined);

      if (!matchData || !api) return null;

      const resolvedData = await resolve(api, matchData);
      const resolvedOutput = buildValueLabel(resolvedData);

      const value: FormTypeMap[ModelType.MATCH][] = resolvedOutput.value.map(
        (v) => {
          return { ...v, date: v.date?.toString() };
        },
      );
      const label: Record<string, any>[] = resolvedOutput.label;

      return { value, label };
    },
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "取得したデータを編集してください",
    type: StepType.FORM,
    many: true,
    fields: getFields([
      "home_team",
      "away_team",
      "stadium",
      "stadium_name",
      "match_format",
      "match_week",
      "date",
      "audience",
      "home_goal",
      "away_goal",
      "home_pk_goal",
      "away_pk_goal",
      "weather",
      "temperature",
      "humidity",
      "transferurl",
      "sofaurl",
      "urls",
    ]),
    validate: validateStadiumEitherOne,
  },
];
