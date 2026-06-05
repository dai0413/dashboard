import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";
import { From } from "../../../../../types/types";
import { addPostedDraftData } from "../addPostedDraftData";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const playerAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const url: string = metaData.matchUrl;
      const match: string[] = metaData.match;

      return await getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: match,
          readParams: { url },
          from: From.D_M,
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
    many: true,
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const cardIds: string[] = metaData.card_ids;

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: cardIds,
          readParams: { cardId: cardIds },
          from: From.D_M,
        },
        postedDraftData,
        season: metaData.season,
      });
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
