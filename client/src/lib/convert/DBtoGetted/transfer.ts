import { Transfer, TransferGet } from "../../../types/models/transfer";

export const transfer = (t: Transfer): TransferGet => {
  const from_team = {
    label: t.from_team ? t.from_team.abbr || t.from_team.team : "",
    id: t.from_team && "_id" in t.from_team ? t.from_team._id : "",
  };

  const to_team = {
    label: t.to_team ? t.to_team.abbr || t.to_team.team : "",
    id: t.to_team && "_id" in t.to_team ? t.to_team._id : "",
  };

  return {
    ...t,
    doa: typeof t.doa === "string" ? new Date(t.doa) : t.doa,
    from_date:
      typeof t.from_date === "string" ? new Date(t.from_date) : t.from_date,
    to_date: typeof t.to_date === "string" ? new Date(t.to_date) : t.to_date,
    player: {
      label: t.player?.name ?? "",
      id: t.player?._id ?? "",
    },
    from_team,
    to_team,
  };
};
