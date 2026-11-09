import { OptionObj } from "../../../types/form/option";
import { MatchFormat } from "../../../types/models/match-format";
import { ColumnType } from "../../../types/table";
import { MatchFormatOption } from "../types/model/match-format";

export const matchFormat = (
  data: MatchFormat[],
): OptionObj<MatchFormatOption> => {
  const options: MatchFormatOption[] = data.map((d) => ({
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
