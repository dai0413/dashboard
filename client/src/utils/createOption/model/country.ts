import { OptionObj } from "../../../types/form/option";
import { Country } from "../../../types/models/country";
import { ColumnType } from "../../../types/table";
import { CountryOption } from "../types/model/country";

export const country = (data: Country[]): OptionObj<CountryOption> => {
  const options: CountryOption[] = data.map((d) => ({
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
