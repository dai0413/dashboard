import { API_PATHS } from "@dai0413/myorg-shared";
import { Form as BaseData } from "@dai0413/myorg-shared/types/j_m/values";
import { Form as PositionData } from "@dai0413/myorg-shared/types/sn_m/position";
import {
  DataSource,
  FilterConditionsByKey,
  FormStep,
  StepType,
} from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { createItemBase, readItemsBase } from "../../api";
import { Season } from "../../../types/models/season";
import { convert } from "../../convert/CreateLabel";
import { CompetitionStage } from "../../../types/models/competition-stage";

export const match: FormStep<ModelType.MATCH>[] = [
  {
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合の大会を入力",
    type: StepType.FORM,
    fields: [
      {
        key: "competition",
        label: "大会",
        fieldType: "table",
        valueType: "option",
        required: true,
        dataSource: DataSource.META_DATA,
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
    fields: [
      {
        key: "season",
        label: "シーズン",
        fieldType: "table",
        valueType: "option",
        required: true,
        dataSource: DataSource.META_DATA,
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
    fields: [
      {
        key: "competition_stage",
        label: "大会ステージ",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "更新する試合のJ_M:URLを入力",
    type: StepType.FORM,
    fields: [
      {
        key: "getDataUrl",
        label: "データ取得url",
        fieldType: "input",
        valueType: "text",
        required: true,
        dataSource: DataSource.META_DATA,
      },
      {
        key: "getPositionUrl",
        label: "ポジション取得url",
        fieldType: "input",
        valueType: "text",
        dataSource: DataSource.META_DATA,
      },
    ],
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "J_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    addDraftData: async ({ metaData, api }) => {
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

      const baseData: BaseData = res.data;

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
    getDraftData: ({ draftData, metaData }) => {
      const getDataUrl = metaData.getDataUrl;

      const data = draftData[getDataUrl][ModelType.MATCH];

      const value: FormTypeMap[ModelType.MATCH] = {
        ...data,
        date: data.date?.toString(),
        home_team: data.home_team?.id,
        away_team: data.away_team?.id,
        stadium: data.stadium?.id,
        match_format: data.match_format?.id,
        competition_stage: data.competition_stage,
      };

      const label: Record<string, any> = {
        ...data,
        date: data.date,
        home_team: data.home_team?.label,
        away_team: data.away_team?.label,
        stadium: data.stadium?.label,
        match_format: data.match_format?.label,
        competition_stage: data.competition_stage,
      };

      return { value, label };
    },
  },
  {
    modelType: ModelType.MATCH,
    stepLabel: "取得したデータを編集してください",
    type: StepType.FORM,
    fields: [
      {
        key: "home_team",
        label: "ホームチーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "away_team",
        label: "アウェイチーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "stadium",
        label: "スタジアム",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "stadium_name",
        label: "登録外スタジアム",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "match_format",
        label: "試合形式",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "match_week",
        label: "節",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "date",
        label: "日付",
        fieldType: "input",
        valueType: "datetime-local",
      },
      {
        key: "audience",
        label: "観客数",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "home_goal",
        label: "ホーム得点",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "away_goal",
        label: "アウェイ得点",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "home_pk_goal",
        label: "ホームPK得点",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "away_pk_goal",
        label: "アウェイPK得点",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "weather",
        label: "天気",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "temperature",
        label: "気温",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "humidity",
        label: "湿度",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "transferurl",
        label: "transferurl",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "sofaurl",
        label: "sofaurl",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "urls",
        label: "urls",
        fieldType: "textarea",
        valueType: "text",
        multi: true,
      },
    ],
  },
];
