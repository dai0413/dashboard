import {
  NationalCallup,
  NationalCallupGet,
} from "../../../types/models/national-callup";
import { leftReason } from "../../../utils/createOption/Enum/leftReason";
import { status } from "../../../utils/createOption/Enum/status";

export const nationalCallup = (t: NationalCallup): NationalCallupGet => {
  const statusOptions = status().find((item) => item.key === t.status)?.label;
  const left_reason = leftReason().find(
    (item) => item.key === t.left_reason
  )?.label;

  return {
    ...t,
    joined_at:
      typeof t.joined_at === "string" ? new Date(t.joined_at) : t.joined_at,
    left_at: typeof t.left_at === "string" ? new Date(t.left_at) : t.left_at,
    series: {
      label: t.series.name ?? "不明",
      id: t.series._id ?? "",
    },
    player: {
      label: t.player.name ?? "不明",
      id: t.player._id ?? "",
    },
    team: {
      label: t.team ? t.team.abbr || t.team.team : "不明",
      id: t.team && "_id" in t.team ? t.team._id : "",
    },
    status: statusOptions ? statusOptions : "",
    left_reason: left_reason ? left_reason : "",
  };
};
