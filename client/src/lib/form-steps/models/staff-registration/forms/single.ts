import { FormStep, FormUpdatePair, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { readItemBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { convert } from "../../../../convert/DBtoGetted";
import { currentTransfer } from "../../../utils/onChange/currentTransfer";
import { getFields } from "../fields";

type BaseModel = ModelType.STAFF_REGISTRATION;
const baseModel = ModelType.STAFF_REGISTRATION;

export const single: FormStep<ModelType.STAFF_REGISTRATION>[] = [
  {
    stepLabel: "大会シーズン選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["season"]),
  },
  {
    stepLabel: "スタッフ選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["staff"]),
    onChange: async (formData, api) => {
      let obj: FormUpdatePair = [];
      if (!formData.staff || !api) return [];

      // name, en_name の設定
      const res = await readItemBase({
        apiInstance: api,
        backendRoute: API_PATHS.STAFF.DETAIL(formData.staff),
        returnResponse: true,
      });

      const { name, en_name } = convert(ModelType.STAFF, res.data);

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
    stepLabel: "登録or抹消・日付・役割・名前・英名を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "registration_type",
      "date",
      "role",
      "name",
      "en_name",
      "note",
    ]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
