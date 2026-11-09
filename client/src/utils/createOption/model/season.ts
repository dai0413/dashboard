import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { Season } from "../../../types/models/season";
import { ColumnType } from "../../../types/table";
import { SeasonOption } from "../types/model/season";

export const season = (data: Season[]): OptionObj<SeasonOption> => {
  const options: SeasonOption[] = data.map((d) => ({
    label: convert(ModelType.SEASON, d),
    key: d._id,
    current: d.current ? "最新" : "",
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
      {
        label: "現在",
        field: "current",
        getValueType: ColumnType.FIELD,
        key: "current",
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
