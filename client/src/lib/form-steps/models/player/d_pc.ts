import { AxiosInstance } from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";
import { readItemsBase } from "../../../api";
import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

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
    fields: [
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
        required: true,
        width: "200px",
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
        width: "200px",
      },
      {
        key: "dob",
        label: "生年月日",
        fieldType: "input",
        valueType: "date",
        width: "200px",
      },
      {
        key: "pob",
        label: "出身地",
        fieldType: "input",
        valueType: "text",
        width: "200px",
      },
    ],
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
