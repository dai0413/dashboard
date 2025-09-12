import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const country: FormStep<ModelType.COUNTRY>[] = [
  {
    stepLabel: "国名を入力",
    type: "form",
    fields: [
      {
        key: "name",
        label: "国名",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "コードを入力",
    type: "form",
    fields: [
      {
        key: "iso3",
        label: "コード",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "fifa_code",
        label: "FIFAコード",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "地域",
    type: "form",
    fields: [
      {
        key: "area",
        label: "地域",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "district",
        label: "詳細地域",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "confederation",
        label: "地域",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "sub_confederation",
        label: "詳細地域",
        fieldType: "select",
        valueType: "option",
      },
    ],
  },
  {
    stepLabel: "協会加入年度",
    type: "form",
    fields: [
      {
        key: "established_year",
        label: "協会成立年",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "fifa_member_year",
        label: "FIFA 加入年",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "association_member_year",
        label: "地域協会加入年",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "district_member_year",
        label: "詳細地域協会加入年",
        fieldType: "input",
        valueType: "number",
      },
    ],
  },
];
