import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { SeasonGet } from "../../types/models/season";

type DateUnit = "day" | "month" | "year";

type SeasonDates = {
  startDate: string | undefined;
  endDate: string | undefined;
  seasonRange: string[];
};

const addDate = (date: Date, amount: number, unit: DateUnit): Date => {
  const d = new Date(date);

  switch (unit) {
    case "day":
      d.setDate(d.getDate() + amount);
      break;

    case "month":
      d.setMonth(d.getMonth() + amount);
      break;

    case "year":
      d.setFullYear(d.getFullYear() + amount);
      break;
  }

  return d;
};

export const getWindowDates = (
  season: SeasonGet | null,
): {
  normalSeason: SeasonDates;
  transferWindow: SeasonDates;
  future: SeasonDates;
} => {
  if (!season) {
    const empty = {
      startDate: undefined,
      endDate: undefined,
      oneYearLater: undefined,
      seasonRange: [],
    };
    return {
      normalSeason: empty,
      transferWindow: empty,
      future: empty,
    };
  }

  const seasonStart = season.start_date
    ? new Date(season.start_date)
    : undefined;

  const seasonEnd = season.end_date ? new Date(season.end_date) : undefined;

  /** normalSeason */
  const normalSeason: SeasonDates = {
    startDate: toDateKey(seasonStart),
    endDate: toDateKey(seasonEnd),
    seasonRange: [
      seasonStart && `>=${toDateKey(seasonStart)}`,
      seasonEnd && `<=${toDateKey(seasonEnd)}`,
    ].filter(Boolean) as string[],
  };

  /** transferWindow */
  const transferWindowStart = seasonStart;
  const transferWindow: SeasonDates = {
    startDate: toDateKey(transferWindowStart),
    endDate: toDateKey(seasonEnd),
    seasonRange: [
      transferWindowStart && `>=${toDateKey(transferWindowStart)}`,
      seasonEnd && `<=${toDateKey(seasonEnd)}`,
    ].filter(Boolean) as string[],
  };

  /** future（end +1日） */
  const futureStart = seasonEnd ? addDate(seasonEnd, 1, "day") : undefined;
  const futureEnd = seasonEnd ? addDate(seasonEnd, 1, "year") : undefined;

  const future: SeasonDates = {
    startDate: toDateKey(futureStart),
    endDate: toDateKey(futureEnd),
    seasonRange: [
      futureStart && `>=${toDateKey(futureStart)}`,
      futureEnd && `<=${toDateKey(futureEnd)}`,
    ].filter(Boolean) as string[],
  };

  return { normalSeason, transferWindow, future };
};
