import { InjuryForm, InjuryGet } from "../../../types/models/injury";

function getInjuryStatus(
  isInjured: string | null | undefined
): boolean | null | undefined {
  if (isInjured === "負傷中") return true;
  if (isInjured === "復帰済み") return false;
  return null;
}

export const injury = (p: InjuryGet): InjuryForm => ({
  ...p,
  doa: p.doa ? p.doa?.toISOString() : "",
  player: p.player.id,
  team: p.team.id,
  now_team: p.team?.id ?? "不明",
  doi: p.doi ? p.doi?.toISOString() : "",
  dos: p.dos instanceof Date ? p.dos.toISOString() : "",
  erd: p.erd ? p.erd?.toISOString() : "",
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
