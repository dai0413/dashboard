import { AxiosInstance } from "axios";
import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";

export const staff: FormStep<ModelType.STAFF>[] = [
  {
    stepLabel: "D_SCデータを取得します",
    type: StepType.FORM,
    modelType: ModelType.STAFF,
    fetchValue: async (_data, api?: AxiosInstance) => {
      if (!api) return [];
      const res = await readItemsBase({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_SC.STAFF,
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
    modelType: ModelType.STAFF,
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
        key: "citizenship",
        label: "国籍",
        fieldType: "table",
        valueType: "option",
        multi: true,
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
