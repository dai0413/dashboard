import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { From } from "../../../../../types/types";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../j_m/preMatchSelectStep";
import { getDraftData } from "../getDraftData";

type BaseModel = ModelType.STAFF_APPEARANCE;
const baseModel = ModelType.STAFF_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, true);

export const staffAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "J_M, STAFF_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const url: string = metaData.getDataUrl;
      const match: string[] = metaData.match;

      if (!url || !match) return { value: [], label: [] };

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: match,
          requests: [
            {
              draftDataKey: "staffAppearance",
              from: From.J_M,
              params: { url },
            },
          ],
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
    stepLabel: "J_M, STAFF_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const getDataUrl: string = metaData.getDataUrl;

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: [getDataUrl],
          requests: [
            {
              draftDataKey: "staffAppearance",
              from: From.J_M,
              params: { url: getDataUrl },
            },
          ],
        },
        postedDraftData,
        season: metaData.season,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
