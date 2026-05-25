import { API_PATHS } from "@dai0413/myorg-shared";
import { DataSource, DraftData, FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { Match } from "../../../types/models/match";
import { createItemBase, readItemBase } from "../../api";
import { getPreMatchSelect } from "../core/preMatchSelectStep";

type BaseModel = ModelType.STATS_L;
const baseModel = ModelType.STATS_L;

export const preStep: FormStep<BaseModel>[] = [
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

      console.log("metaData", metaData);

      // const matchId: string[] = metaData.match;
      const matchIds = ["694356b435e6b4bcfd8e385e", "694356b435e6b4bcfd8e385f"];

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

      console.log("matchObj", matchObjs);

      if (matchObjs.length === 0) return {};

      const res = await createItemBase<DraftData>({
        apiInstance: api,
        // backendRoute: API_PATHS.GET_NEW_DATA.L_M.STATS,
        backendRoute: "/get-new-data/l-m/values",
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

      console.log("newDraftData", newDraftData);

      return newDraftData;
    },
  },
];
