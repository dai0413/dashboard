import {
  NationalitySquadResult,
  NationalitySquadResultSchema,
} from "@dai0413/myorg-shared/types/aggregate/player";
import { getCountryResponse } from "./country.js";
import { getPlayerResponse } from "./player.js";
import { getTeamCompetitionSeasonResponse } from "./teamCompetitionSeason.js";
import { getTransferResponse } from "./transfer.js";

export const getResponse = async (result: NationalitySquadResult[]) => {
  const responseTransferes = await getTransferResponse(
    result.map((r) => r.transfer),
  );

  const nextTransfers = result.map((r) => r.nextTransfer);

  const validNextTransfers = nextTransfers.filter(
    (transfer): transfer is NonNullable<typeof transfer> => transfer != null,
  );

  const populatedNextTransfers = await getTransferResponse(validNextTransfers);

  let nextTransferIndex = 0;

  const responseNextTransferes = nextTransfers.map((transfer) => {
    if (transfer == null) {
      return null;
    }

    return populatedNextTransfers[nextTransferIndex++];
  });

  const responseCountries = await getCountryResponse(result);
  const responsePlayers = await getPlayerResponse(result);
  const responseTeamCompetitionSeasons =
    await getTeamCompetitionSeasonResponse(result);

  const populatedResult: NationalitySquadResult[] = result.map(
    (item, index) => ({
      country: responseCountries[index],
      player: responsePlayers[index],
      transfer: responseTransferes[index],
      nextTransfer: responseNextTransferes[index],
      teamCompetitionSeason: responseTeamCompetitionSeasons[index],
    }),
  );

  return populatedResult.map((item) =>
    NationalitySquadResultSchema.parse(item),
  );
};
