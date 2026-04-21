import { MatchFormatGet } from "../../../../types/models/match-format";

type PeriodLabelArg = {
  time?: number;
} & Record<string, any>;

export const calcPeriodLabel = (
  d: PeriodLabelArg,
  periods?: MatchFormatGet["period"],
): string | undefined => {
  const period_label = periods?.find((p) => {
    if (p.start == null || p.end == null || !d.time) return false;
    return Number(p.start) < d.time && d.time <= Number(p.end);
  })?.period_label;

  return period_label;
};
