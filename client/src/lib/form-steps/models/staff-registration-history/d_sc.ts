import { AxiosInstance } from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../api";
import { onChangeFillChangesByRegistrationType } from "./onChange/onChangeFillChangesByRegistrationType";
import { validateByRegistrationType } from "../../utils/validate/validateByRegistrationType";

export const staffRegistrationHistory: FormStep<ModelType.STAFF_REGISTRATION_HISTORY>[] =
  [
    {
      stepLabel: "D_SCデータを取得します",
      type: "form",
      fetchValue: async (_data, api?: AxiosInstance) => {
        if (!api) return [];
        const res = await readItemsBase({
          apiInstance: api,
          backendRoute: API_PATHS.GET_NEW_DATA.D_SC.STAFF_REGISTRATION_HISTORY,
          returnResponse: true,
        });

        if (!res) return [];

        return res.data;
      },
      many: true,
      onChange: onChangeFillChangesByRegistrationType,
    },
    {
      stepLabel: "取得したデータを編集してください",
      type: "form",
      fields: [
        {
          key: "season",
          label: "大会シーズン",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
        {
          key: "date",
          label: "日付",
          fieldType: "input",
          valueType: "date",
          overwriteByMany: true,
          width: "200px",
        },
        {
          key: "registration_type",
          label: "登録・抹消",
          fieldType: "select",
          valueType: "option",
          overwriteByMany: true,
        },
        {
          key: "team",
          label: "チーム",
          fieldType: "table",
          valueType: "option",
          overwriteByMany: true,
        },
        {
          key: "staff",
          label: "スタッフ",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
        {
          key: "changes.role",
          label: "役割",
          fieldType: "input",
          valueType: "text",
        },
        {
          key: "changes.name",
          label: "名前",
          fieldType: "input",
          valueType: "text",
        },
        {
          key: "changes.en_name",
          label: "英名",
          fieldType: "input",
          valueType: "text",
        },
        {
          key: "changes.note",
          label: "メモ",
          fieldType: "input",
          valueType: "text",
        },
      ],
      onChange: onChangeFillChangesByRegistrationType,
      validate: validateByRegistrationType,
      many: true,
    },
  ];
