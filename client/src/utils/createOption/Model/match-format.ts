import { OptionObj } from "../../../types/form/option";
import { MatchFormatGet } from "../../../types/models/match-format";
import { ColumnType } from "../../../types/table";
import { MatchFormat } from "../types/optionTable/match-format";

export const matchFormat = (data: MatchFormatGet[]): OptionObj<MatchFormat> => {
  const options: MatchFormat[] = data.map((d) => ({
    label: d.name,
    key: d._id,
  }));

  return {
    fields: [
      {
        label: "名前",
        field: "label",
        getValueType: ColumnType.FIELD,
        key: "label",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
