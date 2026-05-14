import { OptionObj } from "../../../types/form/option";
import { TeamGet } from "../../../types/models/team";
import { ColumnType } from "../../../types/table";
import { Team } from "../types/optionTable/team";

export const team = (data: TeamGet[]): OptionObj<Team> => {
  const options: Team[] = data.map((d) => ({
    label: d.team,
    key: d._id,
    abbr: d.abbr,
    country: d.country,
    age_group: d.age_group,
  }));

  return {
    fields: [
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
        label: "略称",
        field: "abbr",
        key: "abbr",
        width: "100px",
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
