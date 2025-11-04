import { Injury } from "../../../types/models/injury";
import { player } from "./player";

export const injury = (p: Injury): string => {
  return `${p.doa}-${player(p.player)}-injury`;
};
