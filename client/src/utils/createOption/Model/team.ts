import { OptionArray, OptionTable } from "../../../types/option";
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
      header: [
        {
          label: "チーム",
          field: "label",
          id: "label",
          width: "200px",
          type: ColumnType.FIELD,
          defaultDisplay: true,
        },
        {
          label: "略称",
          field: "abbr",
          id: "abbr",
          width: "100px",
          type: ColumnType.FIELD,
          defaultDisplay: true,
        },
        {
          label: "国",
          field: "country",
          id: "country",
          width: "100px",
          type: ColumnType.FIELD,
          defaultDisplay: true,
        },
        {
          label: "年代",
          field: "age_group",
          id: "age_group",
          width: "100px",
          type: ColumnType.FIELD,
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
