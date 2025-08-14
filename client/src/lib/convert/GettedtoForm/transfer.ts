import { TransferForm, TransferGet } from "../../../types/models/transfer";

export const transfer = (t: TransferGet): TransferForm => ({
  ...t,
  doa: t.doa ? t.doa.toISOString() : "",
  from_date: t.from_date ? t.from_date.toISOString() : "",
  to_date: t.to_date ? t.to_date?.toDateString() : "",
  player: t.player.id,
  from_team: t.from_team.id,
  to_team: t.to_team.id,
  from_team_name: !t.from_team.id ? t.from_team.label : undefined,
  to_team_name: !t.to_team.id ? t.to_team.label : undefined,
});
