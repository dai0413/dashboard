import { Referee, RefereeGet } from "../../../types/models/referee";

export const referee = (t: Referee): RefereeGet => {
  const citizenship = t.citizenship?.map((c) => ({
    label: c.name ? c.name : "不明",
    id: "_id" in c ? c._id : "",
  }));

  return {
    ...t,
    dob: typeof t.dob === "string" ? new Date(t.dob) : t.dob,
    player: {
      label: t.player?.name ?? "不明",
      id: t.player?._id ?? "",
    },
    citizenship: citizenship ? citizenship : [],
  };
};
