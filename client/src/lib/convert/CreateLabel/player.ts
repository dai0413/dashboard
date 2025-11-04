import { Player } from "../../../types/models/player";

export const player = (p: Player): string => {
  return p.name || p.en_name || "";
};
