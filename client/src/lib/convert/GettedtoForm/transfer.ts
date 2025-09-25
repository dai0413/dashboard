import { TransferForm, TransferGet } from "../../../types/models/transfer";
import { toDateKey } from "../../../utils";

export const transfer = (t: TransferGet): TransferForm => ({
  ...t,
  doa: t.doa ? toDateKey(t.doa) : "",
  from_date: t.from_date ? toDateKey(t.from_date) : "",
  to_date: t.to_date ? toDateKey(t.to_date) : "",
  player: t.player.id,
  from_team: t.from_team.id,
  to_team: t.to_team.id,
  from_team_name: !t.from_team.id ? t.from_team.label : undefined,
  to_team_name: !t.to_team.id ? t.to_team.label : undefined,
});
