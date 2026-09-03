import { readL_MMap } from "../../../../utils/getDraftData/readMap/readL_M";
import { readPosition } from "./base";
import { ReadPosition, ReadScraped } from "./types";

const readL_MScraped: ReadScraped = async (api, match, formData) => {
  if (!readL_MMap.positions || !match._id || !match.date) return undefined;

  const homeTeam = match.home_team._id;
  const awayTeam = match.away_team._id;

  const alph =
    formData.team === homeTeam
      ? match.home_team.labalph
      : formData.team === awayTeam
        ? match.away_team.labalph
        : undefined;

  if (!alph) return undefined;

  const item = await readL_MMap.positions(api, {
    getParams: [
      {
        date: match.date,
        alph,
        matchId: match._id,
      },
    ],
  });

  if (!item.success) return undefined;

  return item.data[match._id];
};

export const readL_MPosition: ReadPosition = (
  api,
  matchCache,
  scrapedCache,
  formData,
) => readPosition(api, matchCache, scrapedCache, formData, readL_MScraped);
