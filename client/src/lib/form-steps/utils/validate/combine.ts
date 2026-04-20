import { AlertStatus } from "../../../../types/alert";

export const combineValidations =
  <T>(...validators: ((data: Partial<T>) => AlertStatus)[]) =>
  (data: Partial<T>): AlertStatus => {
    for (const validate of validators) {
      const result = validate(data);
      if (!result.success) return result;
    }
    return { success: true };
  };
