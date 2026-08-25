import { Transfer } from "../../../types/models/transfer";
import { player } from "./player";
import { team } from "./team";

export const transfer = (t: Transfer): string => {
  const playerName = player(t.player);

  if (!t.from_team) {
    return `${playerName} : → ${team(t.to_team!)} (${t.form})`;
  }

  if (!t.to_team) {
    return `${playerName} : ${team(t.from_team)} → (${t.form})`;
  }

  return `${playerName} : ${team(t.from_team)} → ${team(t.to_team)} (${t.form})`;
};
