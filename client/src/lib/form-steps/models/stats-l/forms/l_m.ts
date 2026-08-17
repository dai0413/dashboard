import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase, getFields } from "../fields";
import { createField } from "../utils/createField";
import { readItemBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Match } from "../../../../../types/models/match";
import { readL_MMap } from "../../../utils/getDraftData/readMap/readL_M";
import { ReadDraftDataParams } from "../../../utils/getDraftData/types";
import { getDraftData } from "../getDraftData";
import { Team } from "../../../../../types/models/team";
import { getPreMatchSelect } from "../../../l_m/preMatchSelectStep";
import { FormMode } from "../../../../../types/types";

type BaseModel = ModelType.STATS_L;
const baseModel = ModelType.STATS_L;

const preSteps = getPreMatchSelect<BaseModel>(baseModel);

export const statsL: FormStep<BaseModel>[] = [
  ...preSteps,
  {
    stepLabel: "L_M, STATS_Lモデルデータを取得します",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.META_DATA,
    fields: getFields(["match"], { match: { multi: true } }),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "データ取得",
    type: StepType.FORM,
    modelType: baseModel,
    many: true,
    getDraftData: async ({
      api,
      data,
      draftData,
      postedDraftData,
      metaData,
    }) => {
      if (!metaData || !api) return { value: [], label: [] };

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
          readL_MMap.statsL &&
          (await readL_MMap.statsL(api, { getParams: [params] }));

        const statsLDatas = res?.success ? res.data : undefined;
        for (const positinKey in statsLDatas) {
          const key = positinKey as keyof typeof newDraftData;
          newDraftData[key] = {
            ...newDraftData[key],
            statsL: { ...statsLDatas[key] },
          };
        }
      }

      const requests: ReadDraftDataParams["requests"] = [];

      return await getDraftData({
        readDraftDataParams: {
          api,
          draftData: newDraftData,
          identifiers: [match],
          requests,
        },
        postedDraftData,
      });
    },
  },
  {
    stepLabel: "チームを選択, スタッツを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [...getFields(["team"]), ...createField()],
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "L_M, STATS_Lモデルデータを取得します",
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
        readL_MMap.statsL &&
        (await readL_MMap.statsL(api, { getParams: params }));

      const positionDatas = res?.success ? res.data : undefined;

      let newDraftData = draftData;

      for (const positinKey in positionDatas) {
        const key = positinKey as keyof typeof newDraftData;
        newDraftData[key] = {
          ...newDraftData[key],
          statsL: { ...positionDatas[key] },
        };
      }

      let gettedDraftData = await getDraftData({
        readDraftDataParams: {
          api,
          draftData: newDraftData,
          identifiers: cardIds,
          requests: [],
        },
        postedDraftData,
      });

      return gettedDraftData;
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
