import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { TeamZodSchema } from "./team.schema.js";
import { SeasonZodSchema } from "./season.schema.js";
import { CompetitionZodSchema } from "./competition.schema.js";
import { registrationType } from "../enum/registration_type.js";
import { StaffZodSchema } from "./staff.schema.js";
import { getKey } from "../utils/getKey.js";
import { label } from "./utils/label.js";

export const StaffRegistrationHistoryZodSchema = z.object({
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
  registration_type: z
    .enum(getKey(registrationType()))
    .refine((v) => !!v, { message: "registration_typeは必須です" }),
  changes: z
    .object({
      role: z.string().nonempty().optional(),
      name: z.string().nonempty().optional(),
      en_name: z.string().nonempty().optional(),
      note: z.string().nonempty().optional(),
    })
    .optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const StaffRegistrationHistoryFormSchema =
  StaffRegistrationHistoryZodSchema.omit({
    _id: true,
    competition: true,
    createdAt: true,
    updatedAt: true,
  });

export const StaffRegistrationHistoryResponseSchema =
  StaffRegistrationHistoryZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    staff: StaffZodSchema,
    team: TeamZodSchema,
  });

export const StaffRegistrationHistoryPopulatedSchema =
  StaffRegistrationHistoryZodSchema.extend({
    season: SeasonZodSchema,
    competition: CompetitionZodSchema,
    staff: StaffZodSchema,
    team: TeamZodSchema,
  });

export const StaffRegistrationHistoryPopulateLabelSchema =
  StaffRegistrationHistoryZodSchema.extend({
    season: label,
    competition: label,
    staff: label,
    team: label,
  });
