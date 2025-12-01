import { periodLabel } from "@dai0413/myorg-shared";
import {
  MatchFormat,
  MatchFormatGet,
} from "../../../types/models/match-format";

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
