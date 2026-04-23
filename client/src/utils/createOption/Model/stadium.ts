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
      header: [
        {
          label: "名前",
          field: "label",
          type: ColumnType.FIELD,
          id: "label",
          defaultDisplay: true,
        },
        {
          label: "国",
          field: "country",
          type: ColumnType.FIELD,
          id: "country",
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
