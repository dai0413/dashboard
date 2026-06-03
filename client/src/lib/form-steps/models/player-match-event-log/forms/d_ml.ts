import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";

type BaseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
const baseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const playerMatchEventLog: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const cardIds: string[] = metaData.match;

      return getDraftData({
        api,
        draftData,
        postedDraftData,
        cardIds,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData }) => {
      const cardIds = Object.values(postedDraftData)
        .map((c) => (c.match?._id ? c.match?._id : undefined))
        .filter((v) => typeof v === "string");

      return getDraftData({
        api,
        draftData,
        postedDraftData,
        cardIds,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
