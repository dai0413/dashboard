import { AxiosInstance } from "axios";
import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";

export const player: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "D_PCデータを取得します",
    type: "form",
    fetchValue: async (_data, api?: AxiosInstance) => {
      if (!api) return [];
      const res = await readItemsBase({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_PC.PLAYER,
        returnResponse: true,
      });

      if (!res) return [];

      const data = normalizeRows(res.data, [
        { field: "dob", parserKey: ParserKey.DateToString },
      ]);

      return data;
    },
    many: true,
  },
  {
    stepLabel: "取得したデータを編集してください",
    type: "form",
    fields: [
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
        required: true,
        width: "150px",
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
        width: "150px",
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
        width: "100px",
      },
    ],
    many: true,
  },
];
