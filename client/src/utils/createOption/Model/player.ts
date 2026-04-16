import { OptionArray, OptionTable } from "../../../types/option";
import { PlayerGet } from "../../../types/models/player";
import { ColumnType } from "../../../types/table";

type Option = {
  label: string;
  key: string;
  dob: Date | null;
};

export const player = (
  data: PlayerGet[],
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
        { label: "名前", field: "label", type: ColumnType.FIELD, id: "label" },
        { label: "生年月日", field: "dob", type: ColumnType.FIELD, id: "dob" },
      ],
      data: options,
    };
  }

  return options;
};
