import { TransferGet } from "../types/models";

export const transformTransfer = (t: any): TransferGet => ({
  ...t,
  doa: t.doa ? new Date(t.doa) : null,
  from_date: t.from_date ? new Date(t.from_date) : null,
  to_date: t.to_date ? new Date(t.to_date) : null,
  player: {
    label: t.player?.name ?? "不明",
    id: t.player?._id ?? "不明",
  },
  from_team: {
    label:
      t.from_team?.abbr?.trim() !== ""
        ? t.from_team.abbr
        : t.from_team?.team?.trim() !== ""
        ? t.from_team.team
        : "不明",
    id: t.from_team?._id ?? "不明",
  },
  to_team: {
    label:
      t.to_team?.abbr?.trim() !== ""
        ? t.to_team.abbr
        : t.to_team?.team?.trim() !== ""
        ? t.to_team.team
        : "不明",
    id: t.to_team?._id ?? "不明",
  },
});

/** 配列をまとめて変換（既存 API 呼び出し用） */
export const transformTransfers = (raw: any[]): TransferGet[] =>
  raw.map(transformTransfer);
