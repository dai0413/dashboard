import { OnChange, OnChangeReturn } from "../../../../types/form/onChange";

export const combineOnChanges = <FORM extends object, T extends boolean>(
  ...handlers: OnChange<FORM, T>[]
): OnChange<FORM, T> => {
  return async (args) => {
    let currentArgs = { ...args };

    for (const handler of handlers) {
      const result = await handler(currentArgs);

      currentArgs = {
        ...currentArgs,
        ...result,
      };
    }

    return currentArgs as OnChangeReturn<FORM, T>;
  };
};
