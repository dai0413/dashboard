import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { TeamZodSchema } from "./team.schema.js";
import { SeasonZodSchema } from "./season.schema.js";
import { CompetitionZodSchema } from "./competition.schema.js";
import { registrationType } from "../enum/registration_type.js";
import { StaffZodSchema } from "./staff.schema.js";
import { registrationStatus } from "../enum/registration_status.js";
import { getKey } from "../utils/getKey.js";

export const StaffRegistrationZodSchema = z.object({
  _id: objectId,
  date: dateField,
  season: objectId.refine((v) => !!v, {
    message: "seasonは必須です",
  }),
  competition: objectId.refine((v) => !!v, {
    message: "competitionは必須です",
  }),
  staff: objectId.refine((v) => !!v, {
    message: "staffは必須です",
  }),
  team: objectId.refine((v) => !!v, {
    message: "teamは必須です",
  }),
  role: z.string().nonempty().optional(),
  name: z.string().nonempty().optional(),
  en_name: z.string().nonempty().optional(),
  registration_type: z
    .enum(getKey(registrationType()))
    .refine((v) => !!v, { message: "registration_typeは必須です" }),
  registration_status: z
    .enum(getKey(registrationStatus()))
    .default("active")
    .refine((v) => !!v, { message: "registration_statusは必須です" }),
  note: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const StaffRegistrationFormSchema = StaffRegistrationZodSchema.omit({
  _id: true,
  competition: true,
  createdAt: true,
  updatedAt: true,
});

export const StaffRegistrationResponseSchema =
  StaffRegistrationZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    staff: StaffZodSchema,
    team: TeamZodSchema,
  });

export const StaffRegistrationPopulatedSchema =
  StaffRegistrationZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    staff: StaffZodSchema,
    team: TeamZodSchema,
  });
