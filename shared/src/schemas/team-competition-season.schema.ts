import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";
import { TeamZodSchema } from "./team.schema.ts";
import { SeasonZodSchema } from "./season.schema.ts";
import { CompetitionZodSchema } from "./competition.schema.ts";

export const TeamCompetitionSeasonZodSchema = z.object({
  _id: objectId,
  team: objectId.refine((v) => !!v, {
    message: "teamは必須です",
  }),
  season: objectId.refine((v) => !!v, {
    message: "seasonは必須です",
  }),
  competition: objectId.refine((v) => !!v, {
    message: "competitionは必須です",
  }),
  note: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type TeamCompetitionSeasonType = z.infer<
  typeof TeamCompetitionSeasonZodSchema
>;

export const TeamCompetitionSeasonFormSchema =
  TeamCompetitionSeasonZodSchema.omit({
    _id: true,
    competition: true,
    createdAt: true,
    updatedAt: true,
  });

export const TeamCompetitionSeasonResponseSchema =
  TeamCompetitionSeasonZodSchema.extend({
    team: TeamZodSchema,
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
  });

export const TeamCompetitionSeasonPopulatedSchema =
  TeamCompetitionSeasonZodSchema.extend({
    team: TeamZodSchema,
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
  });
