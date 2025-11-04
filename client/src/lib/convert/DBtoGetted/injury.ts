import { Injury, InjuryGet } from "../../../types/models/injury";
import { player } from "../CreateLabel/player";
import { team } from "../CreateLabel/team";

function getInjuryStatus(isInjured: boolean | null | undefined): string | null {
  if (isInjured === true) return "負傷中";
  if (isInjured === false) return "復帰済み";
  return null;
}

export const injury = (p: Injury): InjuryGet => ({
  ...p,
  doa: typeof p.doa === "string" ? new Date(p.doa) : p.doa,
  player: {
    label: player(p.player),
    id: p.player._id,
  },
  team: {
    label: p.team ? team(p.team) : "不明",
    id: p.team?._id ?? undefined,
  },
  now_team: {
    label: p.now_team ? team(p.now_team) : "不明",
    id: p.now_team?._id ?? undefined,
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
  is_injured: getInjuryStatus(p.is_injured),
  doi: typeof p.doi === "string" ? new Date(p.doi) : p.doi,
  dos: typeof p.dos === "string" ? new Date(p.dos) : p.dos,
  erd: typeof p.erd === "string" ? new Date(p.erd) : p.erd,
});
