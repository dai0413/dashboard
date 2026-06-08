import { Label } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getDraftData } from "../getDraftData";
import { From } from "../../../../../types/types";
import { addPostedDraftData } from "../addPostedDraftData";
import { getPreMatchSelect } from "../../../j_m/preMatchSelectStep";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel);

export const match: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "J_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    getDraftData: async ({ draftData, metaData, api, formLabel }) => {
      const getDataUrl: string = metaData.getDataUrl;
      const competition_stage: Label = {
        id: metaData.competition_stage,
        label: formLabel.competition_stage,
      };

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: [getDataUrl],
          requests: [
            {
              draftDataKey: "match",
              from: From.J_M,
              params: { url: getDataUrl },
            },
          ],
        },
        competition_stage,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "J_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    getDraftData: async ({ draftData, metaData, api, formLabel }) => {
      const getDataUrl: string = metaData.getDataUrl;
      const competition_stage: Label = {
        id: metaData.competition_stage,
        label: formLabel.competition_stage,
      };

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: [getDataUrl],
          requests: [
            {
              draftDataKey: "match",
              from: From.J_M,
              params: { url: getDataUrl },
            },
          ],
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
        identifiers: [metaData.getDataUrl],
      }),
  },
];
