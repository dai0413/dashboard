import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";
import { FormMode, From } from "../../../../../types/types";
import { addPostedDraftData } from "../addPostedDraftData";
import { ReadDraftDataParams } from "../../../utils/getDraftData/types";
import { readItemBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Match } from "../../../../../types/models/match";
import { Team } from "../../../../../types/models/team";
import { readL_MMap } from "../../../utils/getDraftData/readMap/readL_M";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(false, baseModel, "id");

export const playerAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({
      api,
      data,
      draftData,
      postedDraftData,
      metaData,
    }) => {
      const url: string = metaData.matchUrl;
      const match: string | undefined = data.match;
      if (!match) return { value: [], label: [] };

      const matchObj = await readItemBase<Match>({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.DETAIL(match),
      });

      if (!matchObj) return { value: [], label: [] };

      let newDraftData = draftData;

      const date = matchObj.date;
      const alph = matchObj.home_team.labalph;

      if (date && alph && match) {
        const params: { date: Date; alph: string; matchId: string } = {
          date,
          alph,
          matchId: match,
        };

        let res =
          readL_MMap.positions &&
          (await readL_MMap.positions(api, { getParams: [params] }));

        const positionDatas = res?.success ? res.data : undefined;
        for (const positinKey in positionDatas) {
          const key = positinKey as keyof typeof newDraftData;
          newDraftData[key] = {
            ...newDraftData[key],
            positions: { ...positionDatas[key] },
          };
        }
      }

      const requests: ReadDraftDataParams["requests"] = [
        {
          draftDataKey: "playerAppearance",
          from: From.D_M,
          params: { url },
        },
      ];

      return await getDraftData({
        readDraftDataParams: {
          api,
          draftData: newDraftData,
          identifiers: [match],
          requests,
        },
        postedDraftData,
        season: metaData.season,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    nextFormMode: FormMode.CREATE,
    many: true,
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const cardIds: string[] = metaData.card_ids;
      const params = (
        await Promise.all(
          cardIds.map(async (cardId) => {
            const value = postedDraftData[cardId];
            if (!value.match) return;

            const { date, home_team } = value.match;

            if (!date || !home_team.id) return;

            const team = await readItemBase<Team>({
              apiInstance: api,
              backendRoute: API_PATHS.TEAM.DETAIL(home_team.id),
            });

            if (!team || !team.labalph) return;

            return {
              date: date,
              alph: team.labalph,
              matchId: cardId,
            };
          }),
        )
      ).filter((d) => typeof d !== "undefined");

      let res =
        readL_MMap.positions &&
        (await readL_MMap.positions(api, { getParams: params }));

      const positionDatas = res?.success ? res.data : undefined;

      let newDraftData = draftData;

      for (const positinKey in positionDatas) {
        const key = positinKey as keyof typeof newDraftData;
        newDraftData[key] = {
          ...newDraftData[key],
          positions: { ...positionDatas[key] },
        };
      }

      let gettedDraftData = await getDraftData({
        readDraftDataParams: {
          api,
          draftData: newDraftData,
          identifiers: cardIds,
          requests: [
            {
              draftDataKey: "playerAppearance",
              from: From.D_M,
              params: { cardId: cardIds },
            },
          ],
        },
        postedDraftData,
        season: metaData.season,
      });

      return gettedDraftData;
    },
  },
  bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: ({ metaData, res, postedDraftData }) =>
      addPostedDraftData({
        postedDraftData,
        res,
        identifiers: metaData.card_ids,
      }),
  },
];
