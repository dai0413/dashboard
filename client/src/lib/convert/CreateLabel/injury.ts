import { Injury } from "../../../types/models/injury";
import { player } from "./player";
import { team } from "./team";

export const injury = (t: Injury): string => {
  return `${player(t.player)} (${t.team ? team(t.team) : ""}) : ${t.injured_part} ${t.ttp}`;
};
