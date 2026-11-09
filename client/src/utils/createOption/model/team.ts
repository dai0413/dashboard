import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { Team } from "../../../types/models/team";
import { ColumnType } from "../../../types/table";
import { TeamOption } from "../types/model/team";

export const team = (data: Team[]): OptionObj<TeamOption> => {
  const options: TeamOption[] = data.map((d) => ({
    label: d.team,
    key: d._id,
    abbr: d.abbr,
    country: d.country
      ? {
          label: convert(ModelType.COUNTRY, d.country),
          id: d.country._id,
        }
      : undefined,
    age_group: d.age_group,
  }));

  return {
    fields: [
      {
        label: "略称",
        field: "abbr",
        key: "abbr",
        width: "100px",
        getValueType: ColumnType.FIELD,
        displayOnTable: true,
        type: "string",
      },
      {
        label: "チーム",
        field: "label",
        key: "label",
        width: "200px",
        getValueType: ColumnType.FIELD,
        displayOnTable: true,
        type: "string",
      },
      {
        label: "国",
        field: "country",
        key: "country",
        width: "100px",
        getValueType: ColumnType.FIELD,
        displayOnTable: true,
        type: "string",
      },
      {
        label: "年代",
        field: "age_group",
        key: "age_group",
        width: "100px",
        getValueType: ColumnType.FIELD,
        displayOnTable: true,
        type: "string",
      },
    ],
    data: options,
  };
};
