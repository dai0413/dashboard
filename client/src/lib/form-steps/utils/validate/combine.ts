import { AlertStatus } from "../../../../types/alert";

export const combineValidations =
  <T>(
    ...validators: ((
      data: Partial<T>,
      label?: Record<string, any>,
    ) => AlertStatus)[]
  ) =>
  (data: Partial<T>, label?: Record<string, any>): AlertStatus => {
    for (const validate of validators) {
      const result = validate(data, label);
      if (!result.success) return result;
    }
    return { success: true };
  };
