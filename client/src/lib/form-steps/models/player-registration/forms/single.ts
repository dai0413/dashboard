import { FormStep, FormUpdatePair, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { readItemBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { convert } from "../../../../convert/DBtoGetted";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { getFields } from "../fields";

type BaseModel = ModelType.PLAYER_REGISTRATION;
const baseModel = ModelType.PLAYER_REGISTRATION;

export const single: FormStep<ModelType.PLAYER_REGISTRATION>[] = [
  {
    stepLabel: "大会シーズン選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "選手選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player"]),
    onChange: async (formData, api) => {
      let obj: FormUpdatePair = [];
      if (!formData.player || !api) return [];

      // name, en_name の設定
      const res = await readItemBase({
        apiInstance: api,
        backendRoute: API_PATHS.PLAYER.DETAIL(formData.player),
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
      const { to_team } = await currentTransfer({ formData, api });
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
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "登録or抹消・日付・背番号・POS.・名前・英名・身長・体重を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "registration_type",
      "date",
      "number",
      "position_group",
      "name",
      "en_name",
      "height",
      "weight",
    ]),
  },
  {
    stepLabel: "2種登録・特別指定・HG・メモを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "isTypeTwo",
      "isSpecialDesignation",
      "homegrown",
      "note",
    ]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
