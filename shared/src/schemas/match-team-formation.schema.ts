import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { MatchBaseZodSchema } from "./match.schema.js";
import { TeamZodSchema } from "./team.schema.js";
import { FormationZodSchema } from "./formation.schema.js";

export const MatchTeamFormationZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, { message: "matchは必須です" }),
  team: objectId.refine((v) => !!v, { message: "teamは必須です" }),
  formation: objectId.refine((v) => !!v, { message: "formationは必須です" }),
  createdAt: dateField,
  updatedAt: dateField,
});

export type MatchTeamFormationType = z.infer<
  typeof MatchTeamFormationZodSchema
>;

export const MatchTeamFormationFormSchema = MatchTeamFormationZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const MatchTeamFormationResponseSchema =
  MatchTeamFormationZodSchema.omit({
    match: true,
    team: true,
    formation: true,
  }).safeExtend({
    match: MatchBaseZodSchema,
    team: TeamZodSchema,
    formation: FormationZodSchema,
  });
export const MatchTeamFormationPopulatedSchema =
  MatchTeamFormationZodSchema.omit({
    match: true,
    team: true,
    formation: true,
  }).safeExtend({
    match: MatchBaseZodSchema,
    team: TeamZodSchema,
    formation: FormationZodSchema,
  });
