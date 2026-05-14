import { OptionObj } from "../../../types/form/option";
import { CompetitionGet } from "../../../types/models/competition";
import { ColumnType } from "../../../types/table";
import { Competition } from "../types/optionTable/competition";

export const competition = (data: CompetitionGet[]): OptionObj<Competition> => {
  const options: Competition[] = data.map((d) => ({
    label: d.abbr || d.name || "不明",
    key: d._id,
    country: d.country.label,
    competition_type: d.competition_type,
    category: d.category,
    age_group: d.age_group,
  }));

  return {
    fields: [
      {
        label: "大会名",
        field: "label",
        getValueType: ColumnType.FIELD,
        key: "label",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "国名",
        field: "country",
        getValueType: ColumnType.FIELD,
        key: "country",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "大会タイプ",
        field: "competition_type",
        getValueType: ColumnType.FIELD,
        key: "competition_type",
        displayOnTable: false,
        type: "string",
      },
      {
        label: "カテゴリ",
        field: "category",
        getValueType: ColumnType.FIELD,
        key: "category",
        displayOnTable: true,
        type: "string",
      },
      {
        label: "年代",
        field: "age_group",
        width: "70px",
        getValueType: ColumnType.FIELD,
        key: "age_group",
        displayOnTable: false,
        type: "string",
      },
    ],
    data: options,
  };
};
