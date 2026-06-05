import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";
import { From } from "../../../../../types/types";

type BaseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const baseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const staffMatchEventLog: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, STAFF_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const url: string = metaData.matchUrl;
      const match: string[] = metaData.match;

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: match,
          readParams: { url },
          from: From.D_M,
        },
        postedDraftData,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "D_M, STAFF_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
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
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
