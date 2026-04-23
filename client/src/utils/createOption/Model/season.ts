import { OptionArray, OptionTable } from "../../../types/option";
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
      header: [
        {
          label: "名前",
          field: "label",
          type: ColumnType.FIELD,
          id: "label",
          defaultDisplay: true,
        },
        {
          label: "現在",
          field: "current",
          type: ColumnType.FIELD,
          id: "current",
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
