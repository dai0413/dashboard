import { AxiosInstance } from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { readItemsBase } from "../../../../api";
import { onChangeFillChangesByRegistrationType } from "../onChange/onChangeFillChangesByRegistrationType";
import { validateByRegistrationType } from "../../../utils/validate/validateByRegistrationType";
import { getFields } from "../fields";

type BaseModel = ModelType.STAFF_REGISTRATION_HISTORY;
const baseModel = ModelType.STAFF_REGISTRATION_HISTORY;

export const d_sc: FormStep<ModelType.STAFF_REGISTRATION_HISTORY>[] = [
  {
    stepLabel: "D_SCデータを取得します",
    type: StepType.FORM,
    modelType: baseModel,
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
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields([
      "season",
      "date",
      "registration_type",
      "team",
      "staff",
      "changes.role",
      "changes.name",
      "changes.en_name",
      "changes.note",
    ]),
    onChange: onChangeFillChangesByRegistrationType,
    validate: validateByRegistrationType,
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
