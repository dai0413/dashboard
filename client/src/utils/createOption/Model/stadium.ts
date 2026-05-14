import { OptionObj } from "../../../types/form/option";
import { StadiumGet } from "../../../types/models/stadium";
import { ColumnType } from "../../../types/table";
import { Stadium } from "../types/optionTable/stadium";

export const stadium = (data: StadiumGet[]): OptionObj<Stadium> => {
  const options: Stadium[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    country: d.country.label,
  }));

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
};
