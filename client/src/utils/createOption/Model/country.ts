import { OptionArray, OptionTable } from "../../../types/option";
import { CountryGet } from "../../../types/models/country";

export const country = (
  data: CountryGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    key: d._id,
    label: d.name,
  }));

  if (table === true) {
    return {
      header: [{ label: "国名", field: "label" }],
      data: options,
    };
  }

  return options;
};
