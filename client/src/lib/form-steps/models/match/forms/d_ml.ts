import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { Scraped as MatchScraped } from "@dai0413/myorg-shared/types/get-new-data/models/match";
import { Scraped as CardIdScraped } from "@dai0413/myorg-shared/types/get-new-data/site/d_ml/cardId";

import {
  AddPostedDraftData,
  DataSource,
  FormStep,
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
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
import { convert } from "../../../../convert/DBtoGetted";
import { setTeamByCompetition } from "../../../utils/createFilterConditions/setTeamByCompetition";
import { Season } from "../../../../../types/models/season";
import { optionFieldDefinition } from "../../../../model-fields";
import {
  CardIdOption,
  CustomOptionType,
} from "../../../../../utils/createOption/types/custom";
import { createConfirmationStep } from "../../../confirmationStep";
import { Match } from "../../../../../types/models/match";
import { convert as createLabel } from "../../../../convert/CreateLabel";
import { setCompetition } from "../createQuickFilterItems/setCompetition";
import { ReadCompetitionItems } from "../types";

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
  const res = await createItemBase<{ match: ResolveOutput[] }>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { match: input },
    returnResponse: true,
  });

  if (!res.success) return [];

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

const afterMatchaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  const card_ids: string[] = metaData.card_ids;

  if (!res.success) return {};

  const matchOriginal: Match[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    matchOriginal.map((match, i) => {
      const matchData = convert(ModelType.MATCH, match);
      const label = createLabel(ModelType.MATCH, match);

      const periods = match.match_format?.period;
      const card_id = card_ids[i];

      return [
        card_id,
        {
          ...postedDraftData[card_id],
          matchLabel: label,
          match: { ...matchData },
          periods,
        },
      ];
    }),
  );

  return posted;
};

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const readCompetitionItems: ReadCompetitionItems[] = [
  {
    key: "main",
    label: "J1・J2・J3",
    params: {
      name: [
        "Ｊ１百年構想リーグ",
        "Ｊ２・Ｊ３百年構想リーグ",
        "Ｊ１リーグ",
        "Ｊ２リーグ",
        "Ｊ３リーグ",
      ].join("|"),
    },
    defaultSelect: true,
  },
  {
    key: "po",
    label: "PO・入替",
    params: {
      name: [
        "Ｊ１・Ｊ２入れ替え戦",
        "Ｊ１参入決定戦",
        "Ｊ１参入プレーオフ",
        "Ｊ１昇格プレーオフ",
        "Ｊ２・Ｊ３入れ替え戦",
        "Ｊ２・ＪＦＬ入れ替え戦",
        "Ｊ２昇格プレーオフ",
        "Ｊ３・ＪＦＬ入れ替え戦",
      ].join("|"),
    },
  },
  {
    key: "youth",
    label: "ユース",
    params: {
      name: [
        "Ｊエリートリーグ",
        "Ｊユースリーグ",
        "Ｊリーグ育成マッチデー",
        "Ｊサテライトリーグ",
      ].join("|"),
    },
  },
  {
    key: "cup",
    label: "カップ",
    params: {
      name: [
        "ＦＵＪＩＦＩＬＭ　ＳＵＰＥＲ　ＣＵＰ",
        "ＪリーグYBCルヴァンカップ",
        "オールスター",
        "明治安田生命チャンピオンシップ",
        "Ｊリーグスペシャルマッチ",
        "ＪＯＭＯ　ＣＵＰ",
        "オールスター",
        "ドリームマッチ",
        "サントリーカップ",
        "明治安田ワールドチャレンジ",
      ].join("|"),
    },
  },
];

export const match: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "試合入力準備",
    type: StepType.FORM,
    dataSource: DataSource.META_DATA,
    createQuickFilterItems: (params) =>
      setCompetition({ ...params, items: readCompetitionItems }),
  },
  {
    modelType: baseModel,
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
        convertValueLabel: (data: Season) =>
          createLabel(ModelType.SEASON, data),
        filterKey: "season",
        label: "シーズン",
      });
    },
  },
  {
    modelType: baseModel,
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
          createLabel(ModelType.COMPETITION_STAGE, data),
        filterKey: "competition-stage",
        label: "大会ステージ",
      });
    },
  },
  {
    modelType: baseModel,
    stepLabel: "更新する試合の大会ステージを入力",
    type: StepType.FORM,
    fields: getFields(["competition_stage"]),
    createFilterConditions: setTeamByCompetition,
  },
  {
    modelType: baseModel,
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

      const res = await createItemBase<CardIdScraped[]>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_ML.CARD_IDS,
        data: { url },
        returnResponse: true,
      });

      if (!res.success) return {};

      const data: CardIdOption[] = res.data
        .map((s, i) => {
          return {
            ...s,
            label: `${s.season}-${s.competition}-${i}`,
            key: s.match_card_id,
          };
        })
        .filter((o): o is CardIdOption => o.match_card_id !== undefined);

      const fields = optionFieldDefinition[CustomOptionType.CARD_IDS];

      const options = {
        card_ids: { data, fields },
      };

      return options;
    },
  },
  {
    modelType: baseModel,
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
    modelType: baseModel,
    stepLabel: "J_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ data, metaData, api, formLabel }) => {
      const id = metaData?.card_ids;

      if (!api || !id) return {};

      const res = await createItemBase<DraftData>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_ML.CARD_IDS,
        data: { id },
        returnResponse: true,
      });

      if (!res.success) return {};

      const draftDataValue = res.data;

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
    modelType: baseModel,
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
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterMatchaddPostedDraftData,
  },
];
