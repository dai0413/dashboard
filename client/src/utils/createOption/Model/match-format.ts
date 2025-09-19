import { OptionArray, OptionTable } from "../../../types/option";
import { MatchFormatGet } from "../../../types/models/match-format";

export const matchFormat = (
  data: MatchFormatGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.name,
    key: d._id,
  }));

  if (table === true) {
    return {
      header: [{ label: "名前", field: "label" }],
      data: options,
    };
  }

  return options;
};
