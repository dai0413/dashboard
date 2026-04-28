import { OptionArray, OptionTable } from "../../../types/form/option";
import { SeasonGet } from "../../../types/models/season";
import { ColumnType } from "../../../types/table";

type Option = {
  label: string;
  key: string;
  current: string | null;
};

export const season = (
  data: SeasonGet[],
  table: boolean,
): OptionArray | OptionTable<Option> => {
  const options: Option[] = data.map((d) => ({
    label: `${d.name}-${d.competition.label}`,
    key: d._id,
    current: d.current,
  }));

  if (table === true) {
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
  }

  return options;
};
