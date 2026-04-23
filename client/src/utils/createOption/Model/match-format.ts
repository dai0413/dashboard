import { OptionArray, OptionTable } from "../../../types/option";
import { MatchFormatGet } from "../../../types/models/match-format";
import { ColumnType } from "../../../types/table";
import { MatchFormat } from "../types/optionTable/match-format";

export const matchFormat = (
  data: MatchFormatGet[],
  table: boolean,
): OptionArray | OptionTable<MatchFormat> => {
  const options: MatchFormat[] = data.map((d) => ({
    label: d.name,
    key: d._id,
  }));

  if (table === true) {
    return {
      header: [
        {
          label: "名前",
          field: "label",
          type: ColumnType.FIELD,
          id: "label",
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
