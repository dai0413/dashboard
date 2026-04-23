import { OptionArray, OptionTable } from "../../../types/option";
import { CompetitionGet } from "../../../types/models/competition";
import { ColumnType } from "../../../types/table";
import { Competition } from "../types/optionTable/competition";

export const competition = (
  data: CompetitionGet[],
  table: boolean,
): OptionArray | OptionTable<Competition> => {
  const options: Competition[] = data.map((d) => ({
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
        {
          label: "大会名",
          field: "label",
          type: ColumnType.FIELD,
          id: "label",
          defaultDisplay: true,
        },
        {
          label: "国名",
          field: "country",
          type: ColumnType.FIELD,
          id: "country",
          defaultDisplay: true,
        },
        {
          label: "大会タイプ",
          field: "competition_type",
          type: ColumnType.FIELD,
          id: "competition_type",
          defaultDisplay: false,
        },
        {
          label: "カテゴリ",
          field: "category",
          type: ColumnType.FIELD,
          id: "category",
          defaultDisplay: true,
        },
        {
          label: "年代",
          field: "age_group",
          width: "70px",
          type: ColumnType.FIELD,
          id: "age_group",
          defaultDisplay: false,
        },
      ],
      data: options,
    };
  }

  return options;
};
