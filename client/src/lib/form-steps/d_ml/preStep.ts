import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { createItemBase } from "../../api";
import { DraftData } from "../../../types/form/draftData";
import { getPreMatchSelect } from "./preMatchSelectStep";

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "cardId");

export const preStep: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, VALUESデータを取得します",
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ metaData, api }) => {
      const cardId: string[] = metaData?.card_ids;

      if (!api || !cardId) return {};

      const res = await createItemBase<DraftData>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_M.VALUES,
        data: { cardId },
        returnResponse: true,
      });

      if (!res.success) return {};

      const draftDataValue = res.data;

      return draftDataValue;
    },
  },
];
