import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";

type BaseModel = ModelType.STAFF_APPEARANCE;
const baseModel = ModelType.STAFF_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const staffAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, STAFF_APPEARANCEモデルデータを取得します",
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
    stepLabel: "D_M, STAFF_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const cardIds = Object.values(postedDraftData)
        .map((c) => (c.match?._id ? c.match?._id : undefined))
        .filter((v) => typeof v === "string");

      return getDraftData({
        api,
        draftData,
        postedDraftData,
        cardIds,
        season: metaData.season,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
