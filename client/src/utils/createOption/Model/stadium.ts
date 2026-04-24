import { OptionArray, OptionTable } from "../../../types/option";
import { StadiumGet } from "../../../types/models/stadium";
import { ColumnType } from "../../../types/table";

type Option = {
  label: string;
  key: string;
  country: string;
};

export const stadium = (
  data: StadiumGet[],
  table: boolean,
): OptionArray | OptionTable<Option> => {
  const options: Option[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    country: d.country.label,
  }));

  if (table === true) {
    return {
      fields: [
        {
          label: "名前",
          field: "label",
          getValueType: ColumnType.FIELD,
          key: "label",
          displayOnTable: true,
          type: "string",
        },
        {
          label: "国",
          field: "country",
          getValueType: ColumnType.FIELD,
          key: "country",
          displayOnTable: true,
          type: "string",
        },
      ],
      data: options,
    };
  }

  return options;
};
