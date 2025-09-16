import { MatchFormatGet } from "../../types/models/match-format";

export const periodField = (d: MatchFormatGet, targetLabel: string): string => {
  const targetPeriod = d.period.find(
    (period) => period.period_label === targetLabel
  );
  if (!targetPeriod) return ""; // periodが存在しない場合は空文字

  const { start, end } = targetPeriod;

  // start, end 両方 undefined/null の場合
  if (start == null && end == null) {
    return "◯";
  }

  // どちらかが存在する場合
  const startStr = start != null ? `${start}` : "";
  const endStr = end != null ? `${end}` : "";

  return `${startStr}${endStr ? `-${endStr}` : ""}`;
};

export const periodOther = (
  d: MatchFormatGet,
  notTargets: string[]
): string => {
  const targetPeriod = d.period.filter(
    (period) => !notTargets.includes(period.period_label)
  );

  return targetPeriod.map((d) => d.period_label).join(", ");
};
