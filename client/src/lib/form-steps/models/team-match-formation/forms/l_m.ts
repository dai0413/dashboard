import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { dataToFormData } from "../utils/dataToFormData";
import { FormMode } from "../../../../../types/types";

type BaseModel = ModelType.TEAM_MATCH_FORMATION;
const baseModel = ModelType.TEAM_MATCH_FORMATION;

export const multiModel: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "フォーメーションを入力開始",
    type: StepType.FORM,
    nextFormMode: FormMode.CREATE,
    many: true,
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const cardIds: string[] = metaData.card_ids;

      if (!metaData || !postedDraftData || !draftData || !api)
        return { value: [], label: [] };

      const { value, label } = await dataToFormData(
        api,
        draftData,
        postedDraftData,
        cardIds,
      );

      return { value, label };
    },
  },
  bulkBase,
  createConfirmationStep<ModelType.TEAM_MATCH_FORMATION>(
    ModelType.TEAM_MATCH_FORMATION,
  ),
];
