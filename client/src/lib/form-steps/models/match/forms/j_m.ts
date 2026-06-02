import { API_PATHS, Select } from "@dai0413/myorg-shared";
import { Scraped as PositionData } from "@dai0413/myorg-shared/types/get-new-data/data/position";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { Scraped as MatchScraped } from "@dai0413/myorg-shared/types/get-new-data/models/match";

import {
  AddPostedDraftData,
  DataSource,
  FormStep,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createItemBase } from "../../../../api";
import { Season } from "../../../../../types/models/season";
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
import { Match } from "../../../../../types/models/match";
import { convert as createLabel } from "../../../../convert/CreateLabel";
import { convert } from "../../../../convert/DBtoGetted";
import { createConfirmationStep } from "../../../confirmationStep";
import { setCompetition } from "../../../utils/createQuickFilterItems/setCompetition";
import { ReadCompetitionItems } from "../../../types";

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

const resolve = async (api: AxiosInstance, data: MatchScraped) => {
  const input: Input = [data];
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
  let result = postedDraftData;
  const getDataUrl = metaData.getDataUrl;

  if (!res.success) return {};

  const matchOriginal: Match = res.data;

  const match = convert(ModelType.MATCH, matchOriginal);
  const label = createLabel(ModelType.MATCH, matchOriginal);
  const periods = matchOriginal.match_format?.period;
  result = {
    [getDataUrl]: {
      ...result[getDataUrl],
      matchLabel: label,
      match: { ...match },
      periods,
    },
  };

  return result;
};

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

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
    modelType: baseModel,
    stepLabel: "J_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    addDraftData: async ({ data, metaData, api, formLabel }) => {
      const getDataUrl = metaData?.getDataUrl;
      const season = metaData?.season;
      const getPositionUrl = metaData?.getPositionUrl;

      if (!api || !getDataUrl || !season) return {};

      // 並列実行にする
      const [res, positionRes] = await Promise.all([
        createItemBase<DraftDataValue>({
          apiInstance: api,
          backendRoute: API_PATHS.GET_NEW_DATA.J_M.MATCH,
          data: { url: getDataUrl, season },
          returnResponse: true,
        }),
        getPositionUrl
          ? createItemBase<PositionData>({
              apiInstance: api,
              backendRoute: API_PATHS.GET_NEW_DATA.SN_M.POSITION,
              data: { url: getPositionUrl },
              returnResponse: true,
            })
          : Promise.resolve(null),
      ]);

      if (!res.success) return {};

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

      if (!baseData.playerAppearance) return {};

      // ポジションマージ処理
      if (positionRes?.success) {
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
      if (!data || !api || !draftData[getDataUrl][ModelType.MATCH]) return null;

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
    modelType: baseModel,
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
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterMatchaddPostedDraftData,
  },
];
