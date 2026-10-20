import { Player, PlayerGet } from "../../../types/models/player";
import { country } from "../CreateLabel/country";

export const player = (p: Player): PlayerGet => {
  const citizenship = p.citizenship?.map((c) => ({
    label: country(c),
    id: c._id,
  }));

  return {
    ...p,
    dob: typeof p.dob === "string" ? new Date(p.dob) : p.dob,
    citizenship,
  };
};
