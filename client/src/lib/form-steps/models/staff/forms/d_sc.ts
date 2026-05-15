import { AxiosInstance } from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { readItemsBase } from "../../../../api";
import { getFields } from "../fields";
import { StaffForm } from "../../../../../types/models/staff";

type BaseModel = ModelType.STAFF;
const baseModel = ModelType.STAFF;

export const d_sc: FormStep<ModelType.STAFF>[] = [
  {
    stepLabel: "D_SCデータを取得します",
    type: StepType.FORM,
    modelType: baseModel,
    fetchValue: async (_data, api?: AxiosInstance) => {
      if (!api) return [];
      const obj = await readItemsBase<StaffForm[]>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_SC.STAFF,
      });

      if (!obj) return [];

      return obj.data;
    },
    many: true,
  },
  {
    stepLabel: "取得したデータを編集してください",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "name",
      "en_name",
      "dob",
      "citizenship",
      "pob",
      "player",
    ]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
