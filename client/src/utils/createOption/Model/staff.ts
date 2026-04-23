import { OptionArray, OptionTable } from "../../../types/option";
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
      header: [
        {
          label: "名前",
          field: "label",
          type: ColumnType.FIELD,
          id: "label",
          defaultDisplay: true,
        },
        {
          label: "生年月日",
          field: "dob",
          type: ColumnType.FIELD,
          id: "dob",
          defaultDisplay: true,
        },
      ],
      data: options,
    };
  }

  return options;
};
