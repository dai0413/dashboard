import {
  NationalCallupForm,
  NationalCallupGet,
} from "../../../types/models/national-callup";
import { leftReason } from "../../../utils/createOption/leftReason";
import { status } from "../../../utils/createOption/status";

export const nationalCallup = (t: NationalCallupGet): NationalCallupForm => {
  const statusOptions = status().find((item) => item.label === t.status)?.key;
  const left_reason = leftReason().find(
    (item) => item.label === t.left_reason
  )?.key;

  return {
    ...t,
    joined_at: t.joined_at ? t.joined_at.toISOString() : "",
    left_at: t.left_at ? t.left_at.toISOString() : "",
    series: t.series.id,
    player: t.player.id,
    team: t.team.id,
    status: statusOptions,
    left_reason: left_reason,
  };
};
