import { OptionArray, OptionTable } from "../../../types/form/option";
import { TeamGet } from "../../../types/models/team";
import { ageGroup, Label } from "@dai0413/myorg-shared";
import { ColumnType } from "../../../types/table";

const AgeGroupOptions = ageGroup().map((item) => item.key);
type AgeGroup = (typeof AgeGroupOptions)[number] | null;

type Option = {
  label: string;
  key: string;
  abbr: string | undefined;
  country: Label;
  age_group: AgeGroup | undefined;
};

export const team = (
  data: TeamGet[],
  table: boolean,
): OptionArray | OptionTable<Option> => {
  const options: Option[] = data.map((d) => ({
    label: d.team,
    key: d._id,
    abbr: d.abbr,
    country: d.country,
    age_group: d.age_group,
  }));

  if (table === true) {
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
  }

  return options;
};
