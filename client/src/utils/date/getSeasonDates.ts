// 日付だけのinput用: その日のローカル0時に固定
const localDate = (year: number, month: number, day: number) => {
  // 月は0始まりなので month - 1
  const d = new Date(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
};

// === シーズン境界計算関数 ===
export const getSeasonDates = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  let seasonStart: Date;
  let seasonEnd: Date;
  let nextSeasonStart: Date;

  if (month >= 2) {
    seasonStart = localDate(year, 2, 1);
    seasonEnd = localDate(year + 1, 1, 31);
    nextSeasonStart = localDate(year + 1, 2, 1);
  } else {
    seasonStart = localDate(year - 1, 2, 1);
    seasonEnd = localDate(year, 1, 31);
    nextSeasonStart = localDate(year, 2, 1);
  }

  return { seasonStart, seasonEnd, nextSeasonStart };
};
