import { OptionObj } from "../../../types/form/option";
import { StaffGet } from "../../../types/models/staff";
import { ColumnType } from "../../../types/table";
import { Staff } from "../types/optionTable/staff";

export const staff = (data: StaffGet[]): OptionObj<Staff> => {
  const options: Staff[] = data.map((d) => ({
    label: d.name || d.en_name || "不明",
    key: d._id,
    dob: d.dob,
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
};
