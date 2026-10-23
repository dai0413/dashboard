export const getEuropeSeasonRange = (date = new Date()) => {
  const year = date.getFullYear();

  const startYear = date.getMonth() >= 6 ? year : year - 1;

  return {
    seasonStart: new Date(Date.UTC(startYear, 6, 1)),
    seasonEnd: new Date(Date.UTC(startYear + 1, 5, 30)),
  };
};
