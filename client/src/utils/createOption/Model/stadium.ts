import { OptionArray, OptionTable } from "../../../types/option";
import { StadiumGet } from "../../../types/models/stadium";

export const stadium = (
  data: StadiumGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.name,
    key: d._id,
    country: d.country.label,
  }));

  if (table === true) {
    return {
      header: [
        { label: "名前", field: "label" },
        { label: "国", field: "country" },
      ],
      data: options,
    };
  }

  return options;
};
