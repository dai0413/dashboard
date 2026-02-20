import { StatsL } from "../../../types/models/stats-l";

export const statsL = (p: StatsL): string => {
  return `${p.match?.name}-stats-l`;
};
