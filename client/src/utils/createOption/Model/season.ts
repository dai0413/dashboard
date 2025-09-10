import { OptionArray, OptionTable } from "../../../types/option";
import { SeasonGet } from "../../../types/models/season";

export const season = (
  data: SeasonGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: `${d.name}-${d.competition.label}`,
    key: d._id,
    current: d.current,
  }));

  if (table === true) {
    return {
      header: [
        { label: "名前", field: "label" },
        { label: "現在", field: "current" },
      ],
      data: options,
    };
  }

  return options;
};
