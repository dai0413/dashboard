import { convert } from "../../../lib/convert/CreateLabel";
import { OptionObj } from "../../../types/form/option";
import { ModelType } from "../../../types/models";
import { Stadium } from "../../../types/models/stadium";
import { ColumnType } from "../../../types/table";
import { StadiumOption } from "../types/model/stadium";

export const stadium = (data: Stadium[]): OptionObj<StadiumOption> => {
  const options: StadiumOption[] = data.map((d) => ({
    label: d.name,
    key: d._id,
    country: convert(ModelType.COUNTRY, d.country),
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
