import { periodLabel } from ""@dai0413/myorg-shared";
import {
  MatchFormatForm,
  MatchFormatGet,
} from "../../../types/models/match-format";

const periodLabelOptions = periodLabel();

export const matchFormat = (t: MatchFormatGet): MatchFormatForm => {
  const period: MatchFormatGet["period"] = t.period.map((t) => {
    return {
      ...t,
      period_label:
        periodLabelOptions.find((item) => item.label === t.period_label)?.key ??
        "",
    };
  });

  return {
    ...t,
    period: period,
  };
};
