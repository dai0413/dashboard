import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { TeamZodSchema } from "./team.schema.js";
import { SeasonZodSchema } from "./season.schema.js";
import { CompetitionZodSchema } from "./competition.schema.js";
import { position_group } from "../enum/position_group.js";
import { registration_type } from "../enum/registration_type.js";
import { PlayerZodSchema } from "./player.schema.js";

export const PlayerRegistrationHistoryZodSchema = z.object({
  _id: objectId,
  date: dateField,
  season: objectId.refine((v) => !!v, {
    message: "seasonは必須です",
  }),
  competition: objectId.refine((v) => !!v, {
    message: "competitionは必須です",
  }),
  player: objectId.refine((v) => !!v, {
    message: "playerは必須です",
  }),
  team: objectId.refine((v) => !!v, {
    message: "teamは必須です",
  }),
  registration_type: z
    .enum(registration_type)
    .refine((v) => !!v, { message: "registration_typeは必須です" }),
  changes: z.object({
    number: z.number().optional(),
    position_group: z.enum(position_group).optional(),
    name: z.string().nonempty().optional(),
    en_name: z.string().nonempty().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    homegrown: z.boolean().default(false),
    isTypeTwo: z.boolean().default(false),
    isSpecialDesignation: z.boolean().default(false),
    note: z.string().nonempty().optional(),
  }),
  createdAt: dateField,
  updatedAt: dateField,
});

export type PlayerRegistrationHistoryType = z.infer<
  typeof PlayerRegistrationHistoryZodSchema
>;

export const PlayerRegistrationHistoryFormSchema =
  PlayerRegistrationHistoryZodSchema.omit({
    _id: true,
    competition: true,
    createdAt: true,
    updatedAt: true,
  });

export const PlayerRegistrationHistoryResponseSchema =
  PlayerRegistrationHistoryZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    player: PlayerZodSchema,
    team: TeamZodSchema,
  });

export const PlayerRegistrationHistoryPopulatedSchema =
  PlayerRegistrationHistoryZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    player: PlayerZodSchema,
    team: TeamZodSchema,
  });
