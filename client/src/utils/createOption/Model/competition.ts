import { OptionArray, OptionTable } from "../../../types/option";
import { CompetitionGet } from "../../../types/models/competition";

export const competition = (
  data: CompetitionGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.abbr || d.name || "不明",
    key: d._id,
    country: d.country.label,
    competition_type: d.competition_type,
    category: d.category,
    age_group: d.age_group,
  }));

  if (table === true) {
    return {
      header: [
        { label: "大会名", field: "label" },
        { label: "国名", field: "country" },
        { label: "大会タイプ", field: "competition_type" },
        { label: "カテゴリ", field: "category" },
        { label: "年代", field: "age_group", width: "70px" },
      ],
      data: options,
    };
  }

  return options;
};
