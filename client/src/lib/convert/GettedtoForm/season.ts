import { SeasonForm, SeasonGet } from "../../../types/models/season";

function getStatus(isInjured: string | undefined): boolean | undefined {
  if (isInjured === "最新") return true;
  if (isInjured === "") return false;
  return undefined;
}

export const season = (t: SeasonGet): SeasonForm => ({
  ...t,
  competition: t.competition.id,
  current: getStatus(t.current),
});
