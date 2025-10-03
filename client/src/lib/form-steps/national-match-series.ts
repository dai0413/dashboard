import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

export const nationalMatchSeries: FormStep<ModelType.NATIONAL_MATCH_SERIES>[] =
  [
    {
      stepLabel: "名称入力",
      type: "form",
      fields: [
        {
          key: "name",
          label: "活動名",
          fieldType: "input",
          valueType: "text",
          required: true,
        },
      ],
    },
    {
      stepLabel: "国を選択",
      type: "form",
      fields: [
        {
          key: "country",
          label: "国名",
          fieldType: "table",
          valueType: "option",
        },
      ],
    },
    {
      stepLabel: "年代を選択",
      type: "form",
      fields: [
        {
          key: "age_group",
          label: "年代・種別",
          fieldType: "select",
          valueType: "option",
        },
      ],
    },
    // {
    //   stepLabel: "試合を選択",
    //   type: "form",
    //   fields: [
    //     {
    //       key: "matchs",
    //       label: "試合",
    //       fieldType : "table",valueType : "option",
    //     },
    //   ],
    // },
    {
      stepLabel: "日付",
      type: "form",
      fields: [
        {
          key: "joined_at",
          label: "活動開始日",
          fieldType: "input",
          valueType: "date",
        },
        {
          key: "left_at",
          label: "解散日",
          fieldType: "input",
          valueType: "date",
        },
      ],
    },
    {
      stepLabel: "url",
      type: "form",
      fields: [
        {
          key: "urls",
          label: "urls",
          multi: true,
          fieldType: "textarea",
          valueType: "text",
        },
      ],
    },
  ];
