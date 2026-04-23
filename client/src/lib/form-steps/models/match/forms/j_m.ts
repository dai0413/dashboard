import { API_PATHS, Select } from "@dai0413/myorg-shared";
import { Form as PositionData } from "@dai0413/myorg-shared/types/sn_m/position";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";

import {
  DataSource,
  FilterConditionsByKey,
  FormStep,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createItemBase, readItemsBase } from "../../../../api";
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
      const competition = metaData?.competition;

      if (!competition || !api) return null;

      const resBody = await readItemsBase({
        apiInstance: api,
        params: { competition: competition as string },
        backendRoute: API_PATHS.SEASON.ROOT,
        returnResponse: true,
      });

      if (!resBody || !resBody.data) return null;

      const seasons: Season[] = resBody.data;

      const seasonIds = seasons.map((s) => s._id);
      const seasonValueLabels = seasons.map((s) =>
        convert(ModelType.SEASON, s),
      );
      let returnObj: FilterConditionsByKey | null = {
        season: [
          {
            key: "_id",
            label: "シーズン",
            type: "string",
            filterKey: "season",
            filterable: true,
            value: seasonIds,
            valueLabel: seasonValueLabels,
            operator: "equals",
          },
        ],
      };

      return returnObj;
    },
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合の大会ステージを入力",
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
      const season = metaData?.season;

      if (!season || !api) return null;

      const resBody = await readItemsBase({
        apiInstance: api,
        params: { season: season as string },
        backendRoute: API_PATHS.COMPETITION_STAGE.ROOT,
        returnResponse: true,
      });

      if (!resBody || !resBody.data) return null;

      const competitionStages: CompetitionStage[] = resBody.data;

      const competitionStageIds = competitionStages.map((s) => s._id);
      const competitionStageValueLabels = competitionStages.map((s) =>
        convert(ModelType.COMPETITION_STAGE, s),
      );
      let returnObj: FilterConditionsByKey | null = {
        "competition-stage": [
          {
            key: "_id",
            label: "シーズン",
            type: "string",
            filterKey: "competitionStage",
            filterable: true,
            value: competitionStageIds,
            valueLabel: competitionStageValueLabels,
            operator: "equals",
          },
        ],
      };

      return returnObj;
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
