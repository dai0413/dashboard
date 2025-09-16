import {
  MatchFormatForm,
  MatchFormatGet,
} from "../../../types/models/match-format";
import { periodLabel } from "../../../utils/createOption/Enum/";

const periodLabelOptions = periodLabel();

export const matchFormat = (t: MatchFormatGet): MatchFormatForm => {
  const period: MatchFormatGet["period"] = t.period.map((t) => {
    return {
      ...t,
      label: periodLabelOptions.find((item) => item.key === t.label)?.key ?? "",
    };
  });

  return {
    ...t,
    period: period,
  };
};
