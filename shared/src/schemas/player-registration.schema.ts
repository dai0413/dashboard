import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { TeamZodSchema } from "./team.schema.js";
import { SeasonZodSchema } from "./season.schema.js";
import { CompetitionZodSchema } from "./competition.schema.js";
import { positionGroup } from "../enum/positionGroup.js";
import { registrationType } from "../enum/registration_type.js";
import { PlayerZodSchema } from "./player.schema.js";
import { registrationStatus } from "../enum/registration_status.js";
import { getKey } from "../utils/getKey.js";

export const PlayerRegistrationZodSchema = z.object({
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
  number: z.number().optional(),
  position_group: z.enum(getKey(positionGroup())).optional(),
  name: z.string().nonempty().optional(),
  en_name: z.string().nonempty().optional(),
  registration_type: z
    .enum(getKey(registrationType()))
    .refine((v) => !!v, { message: "registration_typeは必須です" }),
  height: z.number().optional(),
  weight: z.number().optional(),
  homegrown: z.boolean().optional(),
  registration_status: z
    .enum(getKey(registrationStatus()))
    .default("active")
    .refine((v) => !!v, { message: "registration_statusは必須です" }),
  isTypeTwo: z.boolean().optional(),
  isSpecialDesignation: z.boolean().optional(),
  note: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type PlayerRegistrationType = z.infer<
  typeof PlayerRegistrationZodSchema
>;

export const PlayerRegistrationFormSchema = PlayerRegistrationZodSchema.omit({
  _id: true,
  competition: true,
  createdAt: true,
  updatedAt: true,
});

export const PlayerRegistrationResponseSchema =
  PlayerRegistrationZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    player: PlayerZodSchema,
    team: TeamZodSchema,
  });

export const PlayerRegistrationPopulatedSchema =
  PlayerRegistrationZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    player: PlayerZodSchema,
    team: TeamZodSchema,
  });
