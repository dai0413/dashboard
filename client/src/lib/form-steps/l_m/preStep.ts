import { API_PATHS } from "@dai0413/myorg-shared";
import { DataSource, DraftData, FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { Match } from "../../../types/models/match";
import { createItemBase, readItemBase } from "../../api";
import { getPreMatchSelect } from "./preMatchSelectStep";
import { createFilterFromParent } from "../utils/createFilterConditions/createFilterFromParent";
import { Competition } from "../../../types/models/competition";
import { convert } from "../../convert/CreateLabel";

type BaseModel = ModelType.STATS_L;
const baseModel = ModelType.STATS_L;

const value = [
  "Ｊ１百年構想リーグ",
  "Ｊ２・Ｊ３百年構想リーグ",
  "Ｊ１リーグ",
  "Ｊ２リーグ",
  "Ｊ３リーグ",
].join("|");

export const preStep: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "試合入力準備",
    type: StepType.FORM,
    dataSource: DataSource.META_DATA,
    createFilterConditions: async ({ api }) => {
      if (!api) return null;
      return createFilterFromParent({
        readItemParams: {
          apiInstance: api,
          params: { name: value },
          backendRoute: API_PATHS.COMPETITION.ROOT,
        },
        convertValueLabel: (data: Competition) =>
          convert(ModelType.COMPETITION, data),
        filterKey: "competition",
        label: "大会",
      });
    },
  },
  ...getPreMatchSelect<BaseModel>(baseModel),
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: baseModel,
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
    addDraftData: async ({ api, draftData, metaData }) => {
      if (!metaData || !api) return {};

      const matchIds: string[] = metaData.match;

      type MatchRef = {
        matchId: string;
        date: Date;
        alph: string;
      };

      const matchObjs: MatchRef[] = (
        await Promise.allSettled(
          matchIds.map(async (matchId) => {
            const matchObj = await readItemBase<Match>({
              apiInstance: api,
              backendRoute: API_PATHS.MATCH.DETAIL(matchId),
            });

            if (matchObj && matchObj.date && matchObj.home_team.labalph) {
              return {
                matchId: matchObj._id,
                date: matchObj.date,
                alph: matchObj.home_team.labalph,
              };
            }

            return null;
          }),
        )
      )
        .filter(
          (result): result is PromiseFulfilledResult<MatchRef | null> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value)
        .filter((v): v is MatchRef => v !== null);

      if (matchObjs.length === 0) return {};

      const res = await createItemBase<DraftData>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.L_M.STATS,
        data: {
          getParams: matchObjs,
        },
      });

      if (!res.success) return {};

      const draftDataValue = res.data;

      const newDraftData: DraftData = {
        ...draftData,
        ...draftDataValue,
      };

      return newDraftData;
    },
  },
];
