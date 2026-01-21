import { FormStep, FormUpdatePair } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";

export const playerMatchEventLog: FormStep<ModelType.PLAYER_MATCH_EVENT_LOG>[] =
  [
    {
      stepLabel: "試合選択",
      type: "form",
      fields: [
        {
          key: "match",
          label: "試合",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
    },
    {
      stepLabel: "イベントタイプ選択",
      type: "form",
      fields: [
        {
          key: "match_event_type",
          label: "イベントタイプ",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
    },
    {
      stepLabel:
        "チーム選択(オウンゴールについては失点した選手,　チームは得点したチームにする)",
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
      stepLabel:
        "選手選択(オウンゴールについては失点した選手,　チームは得点したチームにする)",
      type: "form",
      fields: [
        {
          key: "player",
          label: "選手",
          fieldType: "table",
          valueType: "option",
        },
        {
          key: "player_name",
          label: "登録外選手",
          fieldType: "input",
          valueType: "text",
        },
      ],
      validate: (data) => {
        if (
          data.match_event_type !== "オウンゴール" &&
          !data.player &&
          !data.player_name
        ) {
          return {
            success: false,
            message: "選手を選択・または入力してください",
          };
        }
        return {
          success: true,
        };
      },
    },
    {
      stepLabel: "時間・PK順番を入力",
      type: "form",
      fields: [
        {
          key: "time",
          label: "試合全体のうちの時間(後半 20 分は 65 と入力)",
          fieldType: "input",
          valueType: "number",
        },
        {
          key: "add_time",
          label: "追加タイム",
          fieldType: "input",
          valueType: "number",
        },
        {
          key: "special_time",
          label: "特別時間",
          fieldType: "select",
          valueType: "option",
        },
        {
          key: "order",
          label: "PK順番",
          fieldType: "input",
          valueType: "number",
        },
      ],
      onChange: (data: FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG]) => {
        let obj: FormUpdatePair = [];
        if (data.time) {
          const time_name = data.add_time
            ? `${data.time + data.add_time}`
            : `${data.time}`;
          obj.push({ key: "time_name", value: time_name });
        }
        //   if (data.match_event_type) {
        //     const { nextSeasonStart } = getSeasonDates();
        //     obj.push({ key: "periold_label", value: nextSeasonStart });
        //   }
        return obj;
      },
    },
  ];
