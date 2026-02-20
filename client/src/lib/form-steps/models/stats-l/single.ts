import { numberFields } from "@dai0413/myorg-shared";
import { FormFieldDefinition, FormStep } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
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

export const statsL: FormStep<ModelType.STATS_L>[] = [
  {
    stepLabel: "試合を選択",
    type: "form",
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    createFilterConditions: async (data: FormTypeMap[ModelType.STATS_L], api) =>
      setMatchTeam(data, api),
  },
  {
    stepLabel: "チームを選択",
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
    stepLabel: "スタッツを入力",
    type: "form",
    fields: createField(),
  },
];
