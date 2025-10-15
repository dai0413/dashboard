import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";

export const TeamCompetitionSeasonZodSchema = z.object({
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
export const TeamCompetitionSeasonZodSchemaArray = z.array(
  TeamCompetitionSeasonZodSchema
);
