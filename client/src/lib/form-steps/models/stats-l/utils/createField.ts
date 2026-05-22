import { numberFields } from "@dai0413/myorg-shared";
import { FormFieldDefinition } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";

export const createField = (): FormFieldDefinition<ModelType.STATS_L>[] => {
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
