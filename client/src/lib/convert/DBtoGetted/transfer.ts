import { Transfer, TransferGet } from "../../../types/models/transfer";
import { Label } from "../../../types/types";
import { player } from "../CreateLabel/player";
import { team } from "../CreateLabel/team";

export const transfer = (t: Transfer): TransferGet => {
  let newFrom_team: Label | null = null;

  if ("from_team" in t && t.from_team) {
    if (t.from_team._id) {
      newFrom_team = { label: team(t.from_team), id: t.from_team._id };
    } else {
      newFrom_team = { label: t.from_team.team, id: undefined };
    }
  }

  let newTo_team: Label | null = null;

  if ("to_team" in t && t.to_team) {
    if (t.to_team._id) {
      newTo_team = { label: team(t.to_team), id: t.to_team._id };
    } else {
      newTo_team = { label: t.to_team.team, id: undefined };
    }
  }

  return {
    ...t,
    doa: typeof t.doa === "string" ? new Date(t.doa) : t.doa,
    from_date:
      typeof t.from_date === "string" ? new Date(t.from_date) : t.from_date,
    to_date: typeof t.to_date === "string" ? new Date(t.to_date) : t.to_date,
    player: {
      label: player(t.player),
      id: t.player?._id,
    },
    from_team: newFrom_team,
    to_team: newTo_team,
  };
};
