import { Referee, RefereeGet } from "../../../types/models/referee";
import { country } from "../CreateLabel/country";
import { player } from "../CreateLabel/player";

export const referee = (t: Referee): RefereeGet => {
  const citizenship = t.citizenship?.map((c) => ({
    label: country(c),
    id: c._id,
  }));

  const playerObj = t.player
    ? {
        label: player(t.player),
        id: t.player?._id ?? undefined,
      }
    : undefined;

  return {
    ...t,
    dob: typeof t.dob === "string" ? new Date(t.dob) : t.dob,
    player: playerObj,
    citizenship: citizenship ? citizenship : [],
  };
};
