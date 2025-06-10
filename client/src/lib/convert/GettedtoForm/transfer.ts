import { TransferForm, TransferGet } from "../../../types/models/transfer";

export const transfer = (t: TransferGet): TransferForm => ({
  ...t,
  doa: t.doa ? t.doa.toISOString() : "",
  from_date: t.from_date ? t.from_date.toISOString() : "",
  to_date: t.to_date ? t.to_date?.toDateString() : "",
  player: t.player.id,
  from_team: t.from_team.id,
  to_team: t.to_team.id,
});
