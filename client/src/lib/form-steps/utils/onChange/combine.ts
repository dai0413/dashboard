import { FormUpdatePair } from "../../../../types/form";
import { OnChange } from "../../../../types/form/onChange";

export const combineOnChanges =
  <T>(...handlers: OnChange<T>[]): OnChange<T> =>
  async (data, api) => {
    const updates: FormUpdatePair = [];

    for (const h of handlers) {
      const result = await h(data, api);
      updates.push(...result);
    }

    return updates;
  };
