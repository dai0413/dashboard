import { API_PATHS } from "@dai0413/myorg-shared";
import { Scraped as CardIdScraped } from "@dai0413/myorg-shared/types/get-new-data/data/cardId";

import {
  CreateFilterConditions,
  DataSource,
  FormStep,
  StepType,
} from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { createItemBase } from "../../api";
import { createFilterFromParent } from "../utils/createFilterConditions/createFilterFromParent";
import { CompetitionStage } from "../../../types/models/competition-stage";
import { setTeamByCompetition } from "../utils/createFilterConditions/setTeamByCompetition";
import { Season } from "../../../types/models/season";
import { optionFieldDefinition } from "../../model-fields";
import {
  CardIdOption,
  CustomOptionType,
} from "../../../utils/createOption/types/custom";
import { convert as createLabel } from "../../convert/CreateLabel";
import { setCompetition } from "../utils/createQuickFilterItems/setCompetition";
import { getFields } from "../models/match/fields";
import { ReadCompetitionItems } from "../types";

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

const getCardIdSelectStep = <K extends keyof FormTypeMap>(
  modelType: keyof FormTypeMap,
): FormStep<K>[] => {
  return [
    {
      modelType: modelType,
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
      skip: (_data, mataData) => mataData.url,
    },
    {
      modelType: modelType,
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
      skip: (_data, mataData) => mataData.card_ids,
    },
  ];
};

const getMatchSelectStep = <K extends keyof FormTypeMap>(
  modelType: keyof FormTypeMap,
): FormStep<K>[] => {
  return [
    {
      stepLabel: "試合を選択",
      type: StepType.FORM,
      modelType: modelType,
      dataSource: DataSource.META_DATA,
      fields: [
        {
          key: "matchUrl",
          label: "matchUrl",
          fieldType: "input",
          valueType: "text",
          required: true,
        },
        {
          key: "match",
          label: "試合",
          fieldType: "table",
          valueType: "option",
          required: true,
          multi: true,
        },
      ],
    },
  ];
};

export const getPreMatchSelect = <K extends keyof FormTypeMap>(
  modelType: keyof FormTypeMap,
  matchSelect: "cardId" | "id",
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
            params: { competition: metaData.competition as string },
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
            params: { season: metaData.season as string },
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
  ];

  const option: FormStep<K>[] =
    matchSelect === "cardId"
      ? getCardIdSelectStep(modelType)
      : getMatchSelectStep(modelType);

  return [...base, ...option];
};
