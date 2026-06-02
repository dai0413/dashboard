// 日付だけのinput用: その日のローカル0時に固定
const localDate = (year: number, month: number, day: number) => {
  // 月は0始まりなので month - 1
  const d = new Date(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
};

// === シーズン境界計算関数 ===
const SEASON_START_MONTH: number = import.meta.env.VITE_SEASON_START_MONTH;
const SEASON_START_DAY: number = import.meta.env.VITE_SEASON_START_DAY;

// === シーズン境界計算関数 ===
export const getSeasonDates = () => {
  const now = new Date();

  const thisSeasonStart = localDate(
    now.getFullYear(),
    SEASON_START_MONTH,
    SEASON_START_DAY,
  );

  const isCurrentSeason = now >= thisSeasonStart;

  const startYear = isCurrentSeason ? now.getFullYear() : now.getFullYear() - 1;

  const seasonStart = localDate(
    startYear,
    SEASON_START_MONTH,
    SEASON_START_DAY,
  );

  const nextSeasonStart = localDate(
    startYear + 1,
    SEASON_START_MONTH,
    SEASON_START_DAY,
  );

  const seasonEnd = new Date(nextSeasonStart);
  seasonEnd.setDate(seasonEnd.getDate() - 1);

  return {
    seasonStart,
    seasonEnd,
    nextSeasonStart,
  };
};
