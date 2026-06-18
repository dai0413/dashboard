import { OptionObj } from "../../../types/form/option";
import { CountryGet } from "../../../types/models/country";
import { ColumnType } from "../../../types/table";
import { Country } from "../types/model/country";

export const country = (data: CountryGet[]): OptionObj<Country> => {
  const options: Country[] = data.map((d) => ({
    key: d._id,
    label: d.name,
  }));

  return {
    fields: [
      {
        type: "string",
        label: "国名",
        field: "label",
        key: "label",
        displayOnTable: true,
        getValueType: ColumnType.FIELD,
      },
    ],
    data: options,
  };
};
