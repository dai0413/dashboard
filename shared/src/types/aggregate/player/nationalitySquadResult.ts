import { z } from "zod";

import {
  country,
  player,
  teamCompetitionSeason,
  transfer,
} from "@dai0413/myorg-shared/models-config";

const { SCHEMA: transferSchema } = transfer();
const { SCHEMA: playerSchema } = player();
const { SCHEMA: teamCompetitionSeasonSchema } = teamCompetitionSeason();
const { SCHEMA: countrySchema } = country();

export const NationalitySquadResultSchema = z.object({
  country: countrySchema.RESPONSE,
  teamCompetitionSeason: teamCompetitionSeasonSchema.RESPONSE.nullable(),
  player: playerSchema.RESPONSE,
  transfer: transferSchema.RESPONSE,
  nextTransfer: transferSchema.RESPONSE.nullable(),
});

export type NationalitySquadResult = z.infer<
  typeof NationalitySquadResultSchema
>;
