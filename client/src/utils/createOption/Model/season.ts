import { OptionObj } from "../../../types/form/option";
import { SeasonGet } from "../../../types/models/season";
import { ColumnType } from "../../../types/table";
import { Season } from "../types/optionTable/season";

export const season = (data: SeasonGet[]): OptionObj<Season> => {
  const options: Season[] = data.map((d) => ({
    label: `${d.name}-${d.competition.label}`,
    key: d._id,
    current: d.current,
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
