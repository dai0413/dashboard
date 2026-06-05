import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { bulkBase } from "../fields";
import { getDraftData } from "../getDraftData";
import { Label } from "@dai0413/myorg-shared";
import { From } from "../../../../../types/types";
import { addPostedDraftData } from "../addPostedDraftData";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "cardId");

export const match: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    getDraftData: async ({ api, draftData, metaData, formLabel }) => {
      const cardIds: string[] = metaData.card_ids;
      const competition_stage: Label = {
        id: metaData.competition_stage,
        label: formLabel.competition_stage,
      };

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: cardIds,
          readParams: { cardId: cardIds },
          from: From.D_M,
        },
        competition_stage,
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
        identifiers: metaData.match,
      }),
  },
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "D_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    getDraftData: async ({ api, draftData, metaData, formLabel }) => {
      const cardIds: string[] = metaData.card_ids;
      const competition_stage: Label = {
        id: metaData.competition_stage,
        label: formLabel.competition_stage,
      };

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: cardIds,
          readParams: { cardId: cardIds },
          from: From.D_M,
        },
        competition_stage,
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
