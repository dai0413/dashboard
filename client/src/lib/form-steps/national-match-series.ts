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
          type: "input",
          required: true,
        },
        // {
        //   key: "abbr",
        //   label: "略称",
        //   type: "input",
        // },
      ],
    },
    {
      stepLabel: "チーム情報を入力",
      type: "form",
      fields: [
        {
          key: "country",
          label: "国名",
          type: "table",
        },
        {
          key: "team_class",
          label: "年代・種別",
          type: "select",
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
    //       type: "table",
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
          type: "date",
        },
        {
          key: "left_at",
          label: "解散日",
          type: "date",
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
          type: "multiurl",
        },
      ],
    },
  ];
