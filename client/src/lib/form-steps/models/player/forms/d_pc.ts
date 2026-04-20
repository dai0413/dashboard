import { AxiosInstance } from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";
import { readItemsBase } from "../../../../api";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";

type BaseModel = ModelType.PLAYER;
const baseModel = ModelType.PLAYER;

export const d_pc: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "D_PCデータを取得します",
    type: StepType.FORM,
    modelType: baseModel,
    fetchValue: async (_data, api?: AxiosInstance) => {
      if (!api) return [];
      const res = await readItemsBase({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_PC.PLAYER,
        returnResponse: true,
      });

      if (!res) return [];

      return res.data;
    },
    many: true,
  },
  {
    stepLabel: "取得したデータを編集してください",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["name", "en_name", "dob", "pob"]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
