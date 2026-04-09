import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

export const bulk: FormStep<ModelType.PLAYER>[] = [
  {
    stepLabel: "名前・生年月日・出身地を入力",
    type: StepType.FORM,
    modelType: ModelType.PLAYER,
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
];
