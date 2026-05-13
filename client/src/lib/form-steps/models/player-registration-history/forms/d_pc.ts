import { AxiosInstance } from "axios";
import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { readItemsBase } from "../../../../api";
import { onChangeFillChangesByRegistrationType } from "../onChange/onChangeFillChangesByRegistrationType";
import { validateByRegistrationType } from "../../../utils/validate/validateByRegistrationType";
import { getFields } from "../fields";
import { PlayerRegistrationForm } from "../../../../../types/models/player-registration";

type BaseModel = ModelType.PLAYER_REGISTRATION_HISTORY;
const baseModel = ModelType.PLAYER_REGISTRATION_HISTORY;

export const d_pc: FormStep<ModelType.PLAYER_REGISTRATION_HISTORY>[] = [
  {
    stepLabel: "D_PCデータを取得します",
    type: StepType.FORM,
    modelType: baseModel,
    fetchValue: async (_data, api?: AxiosInstance) => {
      if (!api) return [];
      const obj = await readItemsBase<PlayerRegistrationForm[]>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_PC.PLAYER_REGISTRATION_HISTORY,
        returnResponse: true,
      });

      if (!obj) return [];

      return obj.data;
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
      "player",
      "changes.number",
      "changes.position_group",
      "changes.name",
      "changes.en_name",
      "changes.height",
      "changes.weight",
      "changes.isTypeTwo",
      "changes.isSpecialDesignation",
      "changes.homegrown",
      "changes.note",
    ]),
    onChange: onChangeFillChangesByRegistrationType,
    validate: validateByRegistrationType,
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
