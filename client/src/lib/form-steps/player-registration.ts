import { FormStep, FormUpdatePair } from "../../types/form";
import { ModelType } from "../../types/models";
import { readItemBase } from "../api";
import { API_ROUTES } from "../apiRoutes";
import { convert } from "../convert/DBtoGetted";
import { currentTransfer } from "./utils/onChange/currentTransfer";

export const playerRegistration: FormStep<ModelType.PLAYER_REGISTRATION>[] = [
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
    stepLabel: "選手選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    onChange: async (formData, api) => {
      let obj: FormUpdatePair = [];
      if (!formData.player) return [];

      // name, en_name の設定
      const res = await readItemBase({
        apiInstance: api,
        backendRoute: API_ROUTES.PLAYER.DETAIL(formData.player),
        returnResponse: true,
      });

      const { name, en_name } = convert(ModelType.PLAYER, res.data);

      if (name) {
        obj.push({
          key: "name",
          value: name,
        });
      }

      if (en_name) {
        obj.push({
          key: "en_name",
          value: en_name,
        });
      }

      // teamの設定
      const { to_team } = await currentTransfer(formData, api);
      if (to_team) {
        obj.push({
          key: "team",
          value: to_team,
        });
      }

      return obj;
    },
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
    stepLabel: "登録or抹消・日付・背番号・POS.・名前・英名・身長・体重を入力",
    type: "form",
    fields: [
      {
        key: "registration_type",
        label: "登録・抹消",
        fieldType: "select",
        valueType: "option",
      },

      {
        key: "date",
        label: "日付",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "number",
        label: "背番号",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "position_group",
        label: "ポジション",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "height",
        label: "身長",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "weight",
        label: "体重",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "homegrown",
        label: "ホームグロウン",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "note",
        label: "メモ",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "2種登録・特別指定・HG・メモを入力",
    type: "form",
    fields: [
      {
        key: "isTypeTwo",
        label: "2種登録",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "isSpecialDesignation",
        label: "特別指定",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "homegrown",
        label: "ホームグロウン",
        fieldType: "input",
        valueType: "boolean",
      },
      {
        key: "note",
        label: "メモ",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
];
