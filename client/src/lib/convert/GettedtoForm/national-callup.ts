import { leftReason, status } from "@dai0413/myorg-shared";
import {
  NationalCallupForm,
  NationalCallupGet,
} from "../../../types/models/national-callup";
import { toDateKey } from "../../../utils";

export const nationalCallup = (t: NationalCallupGet): NationalCallupForm => {
  const statusOptions = status().find((item) => item.label === t.status)?.key;
  const left_reason = leftReason().find(
    (item) => item.label === t.left_reason
  )?.key;

  return {
    ...t,
    joined_at: t.joined_at ? toDateKey(t.joined_at) : "",
    left_at: t.left_at ? toDateKey(t.left_at) : "",
    series: t.series.id,
    player: t.player.id,
    team: t.team.id,
    team_name: !t.team.id ? t.team.label : undefined,
    status: statusOptions,
    left_reason: left_reason,
  };
};
