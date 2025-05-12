import { Transfer } from "../src/types/models";

export const transformTransfers = (rawTransfers: any[]): Transfer[] =>
  rawTransfers.map((t) => ({
    ...t,
    doa: new Date(t.doa),
    from_date: t.from_date ? new Date(t.from_date) : null,
    to_date: t.to_date ? new Date(t.to_date) : null,
    player: {
      label: t.player?.name ?? "不明",
      id: t.player?._id ?? "不明",
    },
    from_team: {
      label: t.from_team?.abbr ?? t.from_team?.team ?? "不明",
      id: t.from_team?._id ?? "不明",
    },
    to_team: {
      label: t.to_team?.abbr ?? t.to_team?.team ?? "不明",
      id: t.to_team?._id ?? "不明",
    },
  }));
