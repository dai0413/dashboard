import { OptionArray, OptionTable } from "../../../types/option";
import { CountryGet } from "../../../types/models/country";
import { ColumnType } from "../../../types/table";
import { Country } from "../types/optionTable/country";

export const country = (
  data: CountryGet[],
  table: boolean,
): OptionArray | OptionTable<Country> => {
  const options: Country[] = data.map((d) => ({
    key: d._id,
    label: d.name,
  }));

  if (table === true) {
    return {
      header: [
        { label: "国名", field: "label", type: ColumnType.FIELD, id: "label" },
      ],
      data: options,
    };
  }

  return options;
};
