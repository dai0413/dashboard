import { leftReason, status } from "@dai0413/myorg-shared";
import {
  NationalCallup,
  NationalCallupGet,
} from "../../../types/models/national-callup";
import { Label } from "../../../types/types";
import { nationalMatchSeries } from "../CreateLabel/national-match-series";
import { player } from "../CreateLabel/player";
import { team } from "../CreateLabel/team";

export const nationalCallup = (t: NationalCallup): NationalCallupGet => {
  const statusOptions = status().find((item) => item.key === t.status)?.label;
  const left_reason = leftReason().find(
    (item) => item.key === t.left_reason
  )?.label;

  let newTeam: Label = { id: undefined, label: "" };

  if ("team" in t && t.team) {
    if (t.team._id) {
      newTeam = { label: team(t.team), id: t.team._id };
    } else {
      newTeam = { label: t.team.team, id: undefined };
    }
  }

  return {
    ...t,
    joined_at:
      typeof t.joined_at === "string" ? new Date(t.joined_at) : t.joined_at,
    left_at: typeof t.left_at === "string" ? new Date(t.left_at) : t.left_at,
    series: {
      label: nationalMatchSeries(t.series),
      id: t.series._id,
    },
    player: {
      label: player(t.player),
      id: t.player._id,
    },
    team: newTeam,
    status: statusOptions ? statusOptions : "",
    left_reason: left_reason ? left_reason : "",
  };
};
