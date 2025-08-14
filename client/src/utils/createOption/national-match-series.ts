import { OptionArray, OptionTable } from "../../types/option";
import { NationalMatchSeriesGet } from "../../types/models/national-match-series";

export const nationalMatchSeries = (
  data: NationalMatchSeriesGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.name,
    key: d._id,
    country: d.country.label,
    team_class: d.team_class,
  }));

  if (table === true) {
    return {
      header: [
        { label: "シリーズ名", field: "label" },
        { label: "国名", field: "country" },
        { label: "年代・種別", field: "team_class" },
      ],
      data: options,
    };
  }

  return options;
};
