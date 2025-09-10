import { OptionArray, OptionTable } from "../../../types/option";
import { PlayerGet } from "../../../types/models/player";

export const player = (
  data: PlayerGet[],
  table: boolean
): OptionArray | OptionTable => {
  const options = data.map((d) => ({
    label: d.name || d.en_name || "不明",
    key: d._id,
    dob: d.dob,
  }));

  if (table === true) {
    return {
      header: [
        { label: "名前", field: "label" },
        { label: "生年月日", field: "dob" },
      ],
      data: options,
    };
  }

  return options;
};
