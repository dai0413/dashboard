import { Referee, RefereeGet } from "../../../types/models/referee";
import { country } from "../CreateLabel/country";
import { player } from "../CreateLabel/player";

export const referee = (t: Referee): RefereeGet => {
  const citizenship = t.citizenship?.map((c) => ({
    label: c ? country(c) : "不明",
    id: "_id" in c ? c._id : undefined,
  }));

  return {
    ...t,
    dob: typeof t.dob === "string" ? new Date(t.dob) : t.dob,
    player: {
      label: t.player ? player(t.player) : "不明",
      id: t.player?._id ?? undefined,
    },
    citizenship: citizenship ? citizenship : [],
  };
};
