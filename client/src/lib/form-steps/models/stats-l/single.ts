import { numberFields } from "@dai0413/myorg-shared";
import {
  FormFieldDefinition,
  FormStep,
  StepType,
} from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { setMatchTeam } from "../../utils/createFilterConditions/setMatchTeam";

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
    modelType: ModelType.STATS_L,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: ModelType.STATS_L,
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
    stepLabel: "スタッツを入力",
    type: StepType.FORM,
    modelType: ModelType.STATS_L,
    fields: createField(),
  },
];
