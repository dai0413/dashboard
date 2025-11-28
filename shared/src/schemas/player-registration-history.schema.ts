import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { TeamZodSchema } from "./team.schema.js";
import { SeasonZodSchema } from "./season.schema.js";
import { CompetitionZodSchema } from "./competition.schema.js";
import { positionGroup } from "../enum/positionGroup.js";
import { registrationType } from "../enum/registration_type.js";
import { PlayerZodSchema } from "./player.schema.js";
import { getKey } from "../utils/getKey.js";

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
    .enum(getKey(registrationType()))
    .refine((v) => !!v, { message: "registration_typeは必須です" }),
  changes: z
    .object({
      number: z.number().optional(),
      position_group: z.enum(getKey(positionGroup())).optional(),
      name: z.string().nonempty().optional(),
      en_name: z.string().nonempty().optional(),
      height: z.number().optional(),
      weight: z.number().optional(),
      homegrown: z.boolean().optional(),
      isTypeTwo: z.boolean().optional(),
      isSpecialDesignation: z.boolean().optional(),
      note: z.string().nonempty().optional(),
    })
    .optional(),
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
