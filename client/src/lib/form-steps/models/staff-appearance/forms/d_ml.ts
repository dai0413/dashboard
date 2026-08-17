import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { getDraftData } from "../getDraftData";
import { FormMode, From } from "../../../../../types/types";

type BaseModel = ModelType.STAFF_APPEARANCE;
const baseModel = ModelType.STAFF_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(false, baseModel, "id");

export const staffAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, STAFF_APPEARANCEモデルデータを取得します",
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
              draftDataKey: "staffAppearance",
              from: From.D_M,
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
    stepLabel: "D_M, STAFF_APPEARANCEモデルデータを取得します",
    type: StepType.FORM,
    nextFormMode: FormMode.CREATE,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const cardIds: string[] = metaData.card_ids;

      return getDraftData({
        readDraftDataParams: {
          api,
          draftData,
          identifiers: cardIds,
          requests: [
            {
              draftDataKey: "staffAppearance",
              from: From.D_M,
              params: { cardId: cardIds },
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
