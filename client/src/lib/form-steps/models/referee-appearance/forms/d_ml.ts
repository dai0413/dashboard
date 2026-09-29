import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";
import { FormMode, From } from "../../../../../types/types";
import { MetaData } from "../../../d_ml/types";

type BaseModel = ModelType.REFEREE_APPEARANCE;
const baseModel = ModelType.REFEREE_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(false, baseModel, "id");

export const refereeAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, REFEREE_APPEARANCEモデルデータを取得します",
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
          requests: [
            {
              draftDataKey: "refereeAppearance",
              from: From.D_M,
              params: { url },
            },
          ],
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
    stepLabel: "D_M, REFEREE_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    nextFormMode: FormMode.CREATE,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const { identifiers, data } = metaData as MetaData;

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers,
          requests: [
            {
              draftDataKey: "refereeAppearance",
              from: From.D_M,
              params: data,
            },
          ],
        },
        postedDraftData,
      });
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
