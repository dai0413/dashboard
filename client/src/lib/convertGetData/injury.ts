import { Injury, InjuryGet } from "../../types/models/injury";

export const transformInjury = (p: Injury): InjuryGet => ({
  ...p,
  doa: typeof p.doa === "string" ? new Date(p.doa) : p.doa,
  player: {
    label: p.player?.name ?? "不明",
    id: p.player?._id ?? "不明",
  },
  team: {
    label: p.team ? p.team.abbr || p.team.team : "不明",
    id: p.team?._id ?? "不明",
  },
  now_team: {
    label: p.team ? p.team.abbr || p.team.team : "不明",
    id: p.team?._id ?? "不明",
  },
  ttp: p.ttp
    ? p.ttp.map((tt) =>
        tt
          .replace("m", "ヶ月")
          .replace("d", "日")
          .replace("w", "週間")
          .replace("y", "年")
      )
    : p.ttp,
});
