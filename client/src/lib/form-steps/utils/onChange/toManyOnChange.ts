import { OnChange } from "../../../../types/form/onChange";

export const toManyOnChange = <K extends object>(
  handler: OnChange<K, false>,
): OnChange<K, true> => {
  return async ({ formDatas, formLabels, api, metaData }) => {
    const applied = await Promise.all(
      formDatas.map((formData, i) =>
        handler({
          formData,
          formLabel: formLabels[i],
          api,
          metaData,
        }),
      ),
    );

    return {
      formDatas: formDatas.map((formData, i) => ({
        ...formData,
        ...applied[i].formData,
      })),
      formLabels: formLabels.map((formLabel, i) => ({
        ...formLabel,
        ...applied[i].formLabel,
      })),
    };
  };
};
