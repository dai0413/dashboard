import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";

export const sortDob = (a: PlayerStatistic, b: PlayerStatistic) => {
  if (!a.player.dob && !b.player.dob) return 0;
  if (!a.player.dob) return 1;
  if (!b.player.dob) return -1;

  return new Date(a.player.dob).getTime() - new Date(b.player.dob).getTime();
};
