import { FormStep, DataSource } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { onChangeFillChangesByRegistrationType } from "./onChange/onChangeFillChangesByRegistrationType";
import { validateByRegistrationType } from "../../utils/validate/validateByRegistrationType";

export const staffRegistrationHistory: FormStep<ModelType.STAFF_REGISTRATION_HISTORY>[] =
  [
    {
      stepLabel: "共通要素を入力",
      type: "form",
      fields: [
        {
          key: "season",
          label: "大会シーズン",
          fieldType: "table",
          valueType: "option",
          dataSource: DataSource.BULK_COMMON,
        },
      ],
    },
    {
      stepLabel: "共通要素を入力",
      type: "form",
      fields: [
        {
          key: "team",
          label: "チーム",
          fieldType: "table",
          valueType: "option",
          dataSource: DataSource.BULK_COMMON,
        },
      ],
    },
    {
      stepLabel: "共通要素を入力",
      type: "form",
      fields: [
        {
          key: "date",
          label: "日付",
          fieldType: "input",
          valueType: "date",
          dataSource: DataSource.BULK_COMMON,
        },
        {
          key: "registration_type",
          label: "登録・抹消",
          fieldType: "select",
          valueType: "option",
          dataSource: DataSource.BULK_COMMON,
        },
      ],
    },
    {
      stepLabel: "役割・名前・英名を入力",
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
        },
        {
          key: "registration_type",
          label: "登録・抹消",
          fieldType: "select",
          valueType: "option",
          required: true,
        },
        {
          key: "team",
          label: "チーム",
          fieldType: "table",
          valueType: "option",
          required: true,
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
