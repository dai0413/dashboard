import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { dataToFormData } from "../utils/dataToFormData";

export const multiModel: FormStep<ModelType.TEAM_MATCH_FORMATION>[] = [
  {
    modelType: ModelType.TEAM_MATCH_FORMATION,
    stepLabel: "フォーメーションを入力開始",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      if (!api) return { value: [], label: [] };

      if (metaData && postedDraftData && draftData) {
        const getDataUrl: string = metaData.getDataUrl;
        if (!getDataUrl) return { value: [], label: [] };

        const { value, label } = await dataToFormData(
          api,
          draftData,
          postedDraftData,
          [getDataUrl],
        );

        return { value, label };
      }

      return { value: [], label: [] };
    },
  },
  bulkBase,
  createConfirmationStep<ModelType.TEAM_MATCH_FORMATION>(
    ModelType.TEAM_MATCH_FORMATION,
  ),
];
