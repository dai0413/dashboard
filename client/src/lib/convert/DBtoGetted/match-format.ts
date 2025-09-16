import {
  MatchFormat,
  MatchFormatGet,
} from "../../../types/models/match-format";
import { periodLabel } from "../../../utils/createOption/Enum/";

const periodLabelOptions = periodLabel();

export const matchFormat = (t: MatchFormat): MatchFormatGet => {
  const period: MatchFormatGet["period"] = t.period.map((t) => {
    return {
      ...t,
      period_label:
        periodLabelOptions.find((item) => item.key === t.period_label)?.label ??
        "",
    };
  });

  return {
    ...t,
    period: period,
  };
};
