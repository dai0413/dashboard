import { Transfer } from "../../../types/models/transfer";
import { team } from "./team";

export const transfer = (t: Transfer): string => {
  return `${t.doa}-${t.from_team ? team(t.from_team) : ""}-${
    t.to_team ? team(t.to_team) : ""
  }${t.player}`;
};
