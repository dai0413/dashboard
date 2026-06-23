import { From } from "../../../../../types/types";
import { readD_MMap } from "./readD_M";
import { readJ_MMap } from "./readJ_M";
import { readL_MMap } from "./readL_M";
import { readSN_MMap } from "./readSN_M";

export const readMap = {
  values: {
    [From.D_M]: readD_MMap.values,
    [From.J_M]: readJ_MMap.values,
    [From.L_M]: readL_MMap.values,
  },

  match: {
    [From.D_M]: readD_MMap.match,
    [From.J_M]: readJ_MMap.match,
  },

  playerAppearance: {
    [From.D_M]: readD_MMap.playerAppearance,
    [From.J_M]: readJ_MMap.playerAppearance,
  },

  playerMatchEventLog: {
    [From.D_M]: readD_MMap.playerMatchEventLog,
    [From.J_M]: readJ_MMap.playerMatchEventLog,
  },

  staffAppearance: {
    [From.D_M]: readD_MMap.staffAppearance,
    [From.J_M]: readJ_MMap.staffAppearance,
  },

  staffMatchEventLog: {
    [From.D_M]: readD_MMap.staffMatchEventLog,
    [From.J_M]: readJ_MMap.staffMatchEventLog,
  },

  refereeAppearance: {
    [From.D_M]: readD_MMap.refereeAppearance,
    [From.J_M]: readJ_MMap.refereeAppearance,
  },

  positions: {
    [From.SN_M]: readSN_MMap.positions,
    [From.L_M]: readL_MMap.positions,
  },

  statsL: {
    [From.L_M]: readL_MMap.statsL,
  },
};
