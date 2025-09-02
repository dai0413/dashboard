import { SeasonForm, SeasonGet } from "../../../types/models/season";

function getStatus(
  isInjured: string | null | undefined
): boolean | null | undefined {
  if (isInjured === "最新") return true;
  if (isInjured === "") return false;
  return null;
}

export const season = (t: SeasonGet): SeasonForm => ({
  ...t,
  competition: t.competition.id,
  current: getStatus(t.current),
});
