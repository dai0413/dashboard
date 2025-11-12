import { Player } from "../../../types/models/player";

export const player = (p: Player): string => {
  if (p.name) return p.name;
  if (p.en_name) return p.en_name;
  return "";
};
