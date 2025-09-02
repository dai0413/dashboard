import { Season, SeasonGet } from "../../../types/models/season";

function getStatus(isCurrent: boolean | null | undefined): string | null {
  if (isCurrent === true) return "最新";
  if (isCurrent === false) return "";
  return null;
}

export const season = (t: Season): SeasonGet => {
  return {
    ...t,
    competition: {
      label: t.competition?.name ?? "不明",
      id: t.competition?._id ?? "",
    },
    current: getStatus(t.current),
  };
};
