import { OnChange } from "../../../../types/form/onChange";

export const combineOnChanges =
  <T>(...handlers: OnChange<T>[]): OnChange<T> =>
  async (formData, formLabel, api) => {
    let currentData = { ...formData };
    let currentLabel = { ...formLabel };

    for (const h of handlers) {
      const res = await h(currentData, currentLabel, api);

      if (res.formData) {
        currentData = { ...currentData, ...res.formData };
      }

      if (res.formLabel) {
        currentLabel = { ...currentLabel, ...res.formLabel };
      }
    }

    return {
      formData: currentData,
      formLabel: currentLabel,
    };
  };
