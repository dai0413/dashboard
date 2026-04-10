import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { createConfirmationStep } from "../../confirmationStep";

type BaseModel = ModelType.PLAYER;
const baseModel = ModelType.PLAYER;

export const bulk: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前・生年月日・出身地を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [
      {
        key: "name",
        label: "名前",
        fieldType: "input",
        valueType: "text",
        required: true,
        width: "150px",
      },
      {
        key: "en_name",
        label: "英名",
        fieldType: "input",
        valueType: "text",
        width: "150px",
      },
      {
        key: "dob",
        label: "生年月日",
        fieldType: "input",
        valueType: "date",
        width: "200px",
      },
      {
        key: "pob",
        label: "出身地",
        fieldType: "input",
        valueType: "text",
        width: "100px",
      },
    ],
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
