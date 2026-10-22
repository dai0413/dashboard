import { teamCompetitionSeason } from "@dai0413/myorg-shared/models-config";
import { TeamCompetitionSeasonModel } from "../../../../models/team-competition-season.js";
import z from "zod";
import { getResponseData } from "../../../../utils/getResponseData.js";
import { NationalitySquadResult } from "../types.js";

const { SCHEMA, POPULATE_PATHS, convertFun } = teamCompetitionSeason();

type response = z.infer<typeof SCHEMA.RESPONSE>;
type Populated = z.infer<typeof SCHEMA.POPULATED>;

export const getTeamCompetitionSeasonResponse = async (
  result: NationalitySquadResult[],
) => {
  const seasons = result.map((item) => item.teamCompetitionSeason ?? null);

  const validSeasons = seasons.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  const populatedSeasons = await TeamCompetitionSeasonModel.populate<Populated>(
    validSeasons,
    POPULATE_PATHS,
  );

  const responseById = new Map(
    populatedSeasons.map((item) => {
      const response: response = getResponseData({
        populated: item,
        SCHEMA,
        convertFun,
      });

      return [response._id, response] as const;
    }),
  );

  return seasons.map((season) =>
    season ? (responseById.get(String(season._id)) ?? null) : null,
  );
};
