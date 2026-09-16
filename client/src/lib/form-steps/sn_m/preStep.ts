import { FormStep, StepType } from "../../../types/form";
import { FormMode, From } from "../../../types/types";
import { ModelType } from "../../../types/models";
import { getPreMatchSelect } from "./preMatchSelectStep";
import { readDraftData } from "../utils/getDraftData/readDraftData";
import { ReadDraftDataParams } from "../utils/getDraftData/types";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

export const createPreStep = (
  updateAndCreate: boolean,
): FormStep<BaseModel>[] => {
  const matchSelectSteps = getPreMatchSelect<BaseModel>(
    updateAndCreate,
    baseModel,
  );

  const stepLabel = updateAndCreate
    ? "SN_M 試合更新 + 試合関連新規追加"
    : "SN_M 全新規追加";

  const baseStep: FormStep<BaseModel> = {
    modelType: baseModel,
    stepLabel: stepLabel,
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ metaData, api }) => {
      const getDataUrl: string = metaData?.getDataUrl;

      if (!getDataUrl) return {};

      const requests: ReadDraftDataParams["requests"] = [
        {
          draftDataKey: "values",
          from: From.SN_M,
          params: { url: [getDataUrl] },
        },
      ];

      const updatedDraftData = await readDraftData({
        api,
        draftData: {},
        identifiers: [getDataUrl],
        requests: requests,
      });

      console.log("updatedDraftData", updatedDraftData);

      return updatedDraftData;
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
