import { AxiosInstance } from "axios";
import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";

export const player: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "D_PCデータを取得します",
    type: StepType.FORM,
    modelType: ModelType.PLAYER,
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
    modelType: ModelType.PLAYER,
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
];
