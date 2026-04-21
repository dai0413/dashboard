import { numberFields } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { FormFieldDefinition } from "../../../../../types/form/field";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { getFields } from "../fields";

type BaseModel = ModelType.STATS_L;
const baseModel = ModelType.STATS_L;

const createField = (): FormFieldDefinition<ModelType.STATS_L>[] => {
  const fields: FormFieldDefinition<ModelType.STATS_L>[] = numberFields.map(
    (key) => {
      return {
        key: key,
        label: key,
        fieldType: "input",
        valueType: "number",
      };
    },
  );

  return fields;
};

export const single: FormStep<ModelType.STATS_L>[] = [
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match"]),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "スタッツを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: createField(),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
