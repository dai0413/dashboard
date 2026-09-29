import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { createItemBase } from "../../api";
import { DraftData } from "../../../types/form/draftData";
import { getPreMatchSelect } from "./preMatchSelectStep";
import { FormMode } from "../../../types/types";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

export const createPreStep = (
  updateAndCreate: boolean,
): FormStep<BaseModel>[] => {
  const matchSelectSteps = getPreMatchSelect<BaseModel>(
    updateAndCreate,
    baseModel,
    updateAndCreate ? "id" : "cardId",
  );

  const stepLabel = updateAndCreate
    ? "D_M 試合更新 + 試合関連新規追加"
    : "D_M 全新規追加";

  const baseStep: FormStep<BaseModel> = {
    modelType: baseModel,
    stepLabel: stepLabel,
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ metaData, api }) => {
      if (!api || !metaData.data) return {};

      const res = await createItemBase<DraftData>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_M.VALUES,
        data: metaData.data,
        returnResponse: true,
      });

      if (!res.success) return {};

      const draftDataValue = res.data;

      return draftDataValue;
    },
  };

  const createBaseStep = (updateAndCreate: boolean): FormStep<BaseModel> => {
    if (updateAndCreate) {
      return {
        ...baseStep,
        nextFormMode: FormMode.UPDATE,
      };
    }
    return baseStep;
  };

  const step = createBaseStep(updateAndCreate);

  return [...matchSelectSteps, step];
};
