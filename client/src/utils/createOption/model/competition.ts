import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { Competition } from "../../../types/models/competition";
import { ColumnType } from "../../../types/table";
import { CompetitionOption } from "../types/model/competition";

export const competition = (
  data: Competition[],
): OptionObj<CompetitionOption> => {
  const options: CompetitionOption[] = data.map((d) => ({
    label: convert(ModelType.COMPETITION, d),
    key: d._id,
    country: d.country ? convert(ModelType.COUNTRY, d.country) : "",
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
