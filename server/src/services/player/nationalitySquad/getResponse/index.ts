import {
  NationalitySquadResult,
  NationalitySquadResultSchema,
} from "../types.js";
import { getCountryResponse } from "./country.js";
import { getPlayerResponse } from "./player.js";
import { getTeamCompetitionSeasonResponse } from "./teamCompetitionSeason.js";
import { getTransferResponse } from "./transfer.js";

export const getResponse = async (result: NationalitySquadResult[]) => {
  const responseTransferes = await getTransferResponse(result);
  const responseCountries = await getCountryResponse(result);
  const responsePlayers = await getPlayerResponse(result);
  const responseTeamCompetitionSeasons =
    await getTeamCompetitionSeasonResponse(result);

  const populatedResult: NationalitySquadResult[] = result.map(
    (item, index) => {
      const transfer = responseTransferes[index];
      const country = responseCountries[index];
      const player = responsePlayers[index];
      const teamCompetitionSeason = responseTeamCompetitionSeasons[index];

      return {
        country,
        player,
        transfer,
        teamCompetitionSeason,
      };
    },
  );

  const responseData: NationalitySquadResult[] = populatedResult.map((result) =>
    NationalitySquadResultSchema.parse(result),
  );

  return responseData;
};
