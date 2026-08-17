import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { bulkBase } from "../fields";
import { getDraftData } from "../getDraftData";
import { Label } from "@dai0413/myorg-shared";
import { FormMode, From } from "../../../../../types/types";
import { addPostedDraftData } from "../addPostedDraftData";
import { prepareUpdateData } from "../utils/prepareUpdateData";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(
  false,
  baseModel,
  "cardId",
);

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

      const newValue = await getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: cardIds,
          requests: [
            {
              draftDataKey: "match",
              from: From.D_M,
              params: { cardId: cardIds },
            },
          ],
        },
        competition_stage,
      });

      return newValue;
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

export const multiModel = (updateAndCreate: boolean): FormStep<BaseModel>[] => {
  const firstStepBase: FormStep<BaseModel> = {
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

      const newValue = await getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: cardIds,
          requests: [
            {
              draftDataKey: "match",
              from: From.D_M,
              params: { cardId: cardIds },
            },
          ],
        },
        competition_stage,
      });

      return newValue;
    },
  };

  const createFirstStep = (updateAndCreate: boolean): FormStep<BaseModel> => {
    if (updateAndCreate) {
      return {
        ...firstStepBase,
        nextFormMode: FormMode.UPDATE,
        prepareUpdateData: prepareUpdateData,
      };
    }
    return firstStepBase;
  };

  const firstStep = createFirstStep(updateAndCreate);

  return [
    firstStep,
    bulkBase,
    {
      ...createConfirmationStep<BaseModel>(baseModel),
      addPostedDraftData: ({ metaData, res, postedDraftData }) => {
        const result = addPostedDraftData({
          postedDraftData,
          res,
          identifiers: metaData.card_ids,
        });

        return result;
      },
    },
  ];
};
