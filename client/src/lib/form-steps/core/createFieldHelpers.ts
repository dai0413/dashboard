import { FormFieldDefinition } from "../../../types/form";
import { ModelType } from "../../../types/models";

type FieldOverrides<K extends string> = Partial<
  Record<
    K,
    {
      multi?: true;
      required?: boolean;
    }
  >
>;

export const createFieldHelpers = <
  M extends ModelType,
  K extends Extract<FormFieldDefinition<M>["key"], string>,
>(
  fieldMap: Record<K, FormFieldDefinition<M>>,
) => {
  const getFields = (
    keys: K[],
    overrides?: FieldOverrides<K>,
  ): FormFieldDefinition<M>[] => {
    return keys.map((key) => {
      const base = fieldMap[key];
      const override = overrides?.[key];

      if (override?.multi === true) {
        return {
          ...base,
          multi: true as const,
        } as FormFieldDefinition<M>;
      }

      if (override?.required === true) {
        return {
          ...base,
          required: true as const,
        } as FormFieldDefinition<M>;
      } else if (override?.required === false) {
        return {
          ...base,
          required: false as const,
        } as FormFieldDefinition<M>;
      }

      return base;
    });
  };

  return {
    fieldMap,
    getFields,
  };
};
