import { FormStep } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { validateByRegistrationType } from "../../utils/validate/validateByRegistrationType";
import { onChangeFillChangesByRegistrationType } from "./onChange/onChangeFillChangesByRegistrationType";

export const staffRegistrationHistory: FormStep<ModelType.STAFF_REGISTRATION_HISTORY>[] =
  [
    {
      stepLabel: "登録or抹消を入力",
      type: "form",
      fields: [
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
      ],
    },
    {
      stepLabel: "大会シーズン選択",
      type: "form",
      fields: [
        {
          key: "season",
          label: "大会シーズン",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
    },
    {
      stepLabel: "チーム選択",
      type: "form",
      fields: [
        {
          key: "team",
          label: "チーム",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
    },
    {
      stepLabel: "スタッフ選択",
      type: "form",
      fields: [
        {
          key: "staff",
          label: "スタッフ",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
      onChange: onChangeFillChangesByRegistrationType,
    },
    {
      stepLabel: "役割・名前・英名を入力",
      type: "form",
      fields: [
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
      validate: validateByRegistrationType,
      skip: (data) => {
        return data.registration_type === "deregister";
      },
    },
  ];
