import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.PLAYER;
const baseModel = ModelType.PLAYER;

export const single: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
        required: true,
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  {
    stepLabel: "生年月日・出身地",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "dob",
        label: "生年月日",
        fieldType: "input",
        valueType: "date",
      },
      {
        key: "pob",
        label: "出身地",
        fieldType: "input",
        valueType: "text",
      },
    ],
  },
  createConfirmationStep<BaseModel>(baseModel),
];
