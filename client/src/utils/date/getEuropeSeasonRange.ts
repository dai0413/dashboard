export const getEuropeSeasonRange = (date = new Date()) => {
  const year = date.getFullYear();

  // 7月以降なら今年、6月以前なら前年がシーズン開始年
  const startYear = date.getMonth() >= 6 ? year : year - 1;

  return {
    seasonStart: new Date(startYear, 6, 1),
    seasonEnd: new Date(startYear + 1, 5, 30),
  };
};
