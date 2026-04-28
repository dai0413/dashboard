import { API_PATHS, Select } from "@dai0413/myorg-shared";
import { Form as PositionData } from "@dai0413/myorg-shared/types/sn_m/position";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";

import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createItemBase } from "../../../../api";
import { Season } from "../../../../../types/models/season";
import { convert } from "../../../../convert/CreateLabel";
import { CompetitionStage } from "../../../../../types/models/competition-stage";
import { AxiosInstance } from "axios";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { DraftDataValue } from "../../../../../types/form/draftData";
import { getFields } from "../fields";
import { validateStadiumEitherOne } from "../validations/stadium";
import { setTeamByCompetition } from "../../../utils/createFilterConditions/setTeamByCompetition";
import { createFilterFromParent } from "../../../utils/createFilterConditions/createFilterFromParent";
import { OptionTable } from "../../../../../types/form/option";
import { ColumnType } from "../../../../../types/table";

const sample = [
  {
    season: "2026特別",
    competition: "明治安田Ｊ１百年構想 EASTグループ",
    match_week: 1,
    date: "2026-02-06T10:03:00.000Z",
    home_team: "横浜FM",
    away_team: "町田",
    match_card_id: "32923",
  },
  {
    season: "2026特別",
    competition: "明治安田Ｊ１百年構想 EASTグループ",
    match_week: 1,
    date: "2026-02-07T04:04:00.000Z",
    home_team: "千葉",
    away_team: "浦和",
    match_card_id: "32924",
  },
  {
    season: "2026特別",
    competition: "明治安田Ｊ１百年構想 EASTグループ",
    match_week: 1,
    date: "2026-02-07T04:35:00.000Z",
    home_team: "FC東京",
    away_team: "鹿島",
    match_card_id: "32925",
  },
  {
    season: "2026特別",
    competition: "明治安田Ｊ１百年構想 EASTグループ",
    match_week: 1,
    date: "2026-02-08T06:03:00.000Z",
    home_team: "川崎Ｆ",
    away_team: "柏",
    match_card_id: "32926",
  },
  {
    season: "2026特別",
    competition: "明治安田Ｊ１百年構想 EASTグループ",
    match_week: 1,
    date: "2026-02-08T07:03:00.000Z",
    home_team: "東京Ｖ",
    away_team: "水戸",
    match_card_id: "32927",
  },
];

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

const resolve = async (api: AxiosInstance, data: DraftDataValue["match"]) => {
  const input: Input = [data];
  return fetchResolved(api, input);
};

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

export const match: FormStep<ModelType.MATCH>[] = [
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
        // backendRoute: API_PATHS.GET_NEW_DATA.D_ML.CARD_IDS,
        backendRoute: "/get-new-data/d-ml/card-ids",
        data: { url },
        returnResponse: true,
      });

      if (!res?.data) return {};

      const data: OptionTable<any>["data"] = sample.map((s, i) => {
        return {
          ...s,
          label: `${s.season}-${s.competition}-${i}`,
          key: s.match_card_id,
        };
      });

      const fields: OptionTable<any>["fields"] = [
        {
          key: "season",
          label: "シーズン",
          type: "string",
          displayOnTable: true,
          getValueType: ColumnType.FIELD,
          field: "season",
        },
        {
          key: "competition",
          label: "大会",
          type: "string",
          displayOnTable: true,
          getValueType: ColumnType.FIELD,
          field: "competition",
        },
        {
          key: "match_week",
          label: "節",
          type: "string",
          displayOnTable: true,
          getValueType: ColumnType.FIELD,
          field: "match_week",
        },
        {
          key: "date",
          label: "日付",
          type: "datetime-local",
          displayOnTable: true,
          getValueType: ColumnType.FIELD,
          field: "date",
        },
        {
          key: "home_team",
          label: "ホーム",
          type: "string",
          displayOnTable: true,
          getValueType: ColumnType.FIELD,
          field: "home_team",
        },
        {
          key: "away_team",
          label: "アウェイ",
          type: "string",
          displayOnTable: true,
          getValueType: ColumnType.FIELD,
          field: "away_team",
        },
      ];

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
  {
    modelType: ModelType.MATCH,
    stepLabel: "J_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    addDraftData: async ({ data, metaData, api, formLabel }) => {
      const getDataUrl = metaData?.getDataUrl;
      const season = metaData?.season;
      const getPositionUrl = metaData?.getPositionUrl;

      if (!api || !getDataUrl || !season) return {};

      // 並列実行にする
      const [res, positionRes] = await Promise.all([
        createItemBase({
          apiInstance: api,
          backendRoute: API_PATHS.GET_NEW_DATA.J_M.MATCH,
          data: { url: getDataUrl, season },
          returnResponse: true,
        }),
        getPositionUrl
          ? createItemBase({
              apiInstance: api,
              backendRoute: API_PATHS.GET_NEW_DATA.SN_M.POSITION,
              data: { url: getPositionUrl },
              returnResponse: true,
            })
          : Promise.resolve(null),
      ]);

      if (!res?.data) return {};

      const baseData: DraftDataValue = {
        ...res.data,
        match: {
          ...res.data.match,
          competition_stage: {
            id: data?.competition_stage,
            label: formLabel.competition_stage,
          },
        },
      };

      // ポジションマージ処理
      if (positionRes?.data) {
        const positionData: PositionData = positionRes.data;
        const { home, away } = positionData;

        const mergePosition = (
          target: typeof baseData.playerAppearance.home,
          positions: typeof home,
        ) => {
          positions.forEach((positionData) => {
            const idx = target.findIndex(
              (scraped) => scraped.number === positionData.number,
            );

            if (idx >= 0) {
              target[idx].position = positionData.position;
            }
          });
        };

        mergePosition(baseData.playerAppearance.home, home);
        mergePosition(baseData.playerAppearance.away, away);
      }

      return { [getDataUrl]: baseData };
    },
    getDraftData: async ({ draftData, metaData, api }) => {
      const getDataUrl = metaData.getDataUrl;
      const data = draftData[getDataUrl][ModelType.MATCH];
      if (!data || !api) return null;

      const resolvedData = await resolve(
        api,
        draftData[getDataUrl][ModelType.MATCH],
      );
      const resolvedOutput = buildValueLabel(resolvedData);

      const value = {
        ...resolvedOutput.value[0],
        date: resolvedOutput.value[0].date?.toString(),
      };

      const label = {
        ...resolvedOutput.label[0],
      };

      return { value, label };
    },
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "取得したデータを編集してください",
    type: StepType.FORM,
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
