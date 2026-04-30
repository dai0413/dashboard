import { FormFieldDefinition, UpdateMode } from "../../types/form";
import { FormTypeMap } from "../../types/models";

export function resolveMode<T extends keyof FormTypeMap>(
  field: FormFieldDefinition<T>,
): UpdateMode {
  // multiが最優先
  if (field.multi) {
    if (field.fieldType === "select") {
      return UpdateMode.TOGGLE; // MultiSelect
    }
    return UpdateMode.ARRAY_UPDATE; // MultiInput / MultiTextarea
  }

  // 単一select
  if (field.fieldType === "select") {
    return UpdateMode.REPLACE;
  }

  // デフォルト
  return UpdateMode.REPLACE;
}
