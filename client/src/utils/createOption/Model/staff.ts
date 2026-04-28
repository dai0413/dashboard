import { OptionArray, OptionTable } from "../../../types/form/option";
import { StaffGet } from "../../../types/models/staff";
import { ColumnType } from "../../../types/table";

type Option = {
  label: string;
  key: string;
  dob: Date | undefined;
};

export const staff = (
  data: StaffGet[],
  table: boolean,
): OptionArray | OptionTable<Option> => {
  const options: Option[] = data.map((d) => ({
    label: d.name || d.en_name || "不明",
    key: d._id,
    dob: d.dob,
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
          label: "生年月日",
          field: "dob",
          getValueType: ColumnType.FIELD,
          key: "dob",
          displayOnTable: true,
          type: "string",
        },
      ],
      data: options,
    };
  }

  return options;
};
