import { InjuryForm, InjuryGet } from "../../../types/models/injury";
import { toDateKey } from "../../../utils";

function getInjuryStatus(
  isInjured: string | null | undefined
): boolean | null | undefined {
  if (isInjured === "負傷中") return true;
  if (isInjured === "復帰済み") return false;
  return null;
}

export const injury = (p: InjuryGet): InjuryForm => ({
  ...p,
  doa: p.doa ? toDateKey(p.doa) : "",
  player: p.player.id,
  team: p.team.id,
  now_team: p.team?.id ?? "不明",
  doi: p.doi ? toDateKey(p.doi) : "",
  dos: p.dos instanceof Date ? toDateKey(p.dos) : "",
  erd: p.erd ? toDateKey(p.erd) : "",
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
});
