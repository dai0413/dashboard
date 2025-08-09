import {
  callStatusOptions,
  leftReasonOptions,
} from "../../../context/options-provider";
import {
  NationalCallupForm,
  NationalCallupGet,
} from "../../../types/models/national-callup";

export const nationalCallup = (t: NationalCallupGet): NationalCallupForm => {
  const status = callStatusOptions.find((item) => item.label === t.status)?.key;
  const left_reason = leftReasonOptions.find(
    (item) => item.label === t.left_reason
  )?.key;

  return {
    ...t,
    joined_at: t.joined_at ? t.joined_at.toISOString() : "",
    left_at: t.left_at ? t.left_at.toISOString() : "",
    series: t.series.id,
    player: t.player.id,
    team: t.team.id,
    status: status,
    left_reason: left_reason,
  };
};
