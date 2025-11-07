import { z } from "zod";
import { competition_type } from "../enum/competition_type.js";
import { objectId } from "./utils/objectId.js";
import { category } from "../enum/category.js";
import { level } from "../enum/level.js";
import { age_group } from "../enum/age_group.js";
import { dateField } from "./utils/dateField.js";
import { CountryZodSchema } from "./country.schema.js";

export const CompetitionZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  abbr: z.string().nonempty().optional(),
  en_name: z.string().nonempty().optional(),
  country: objectId.optional(),
  competition_type: z.enum(competition_type).optional(),
  category: z.enum(category).optional(),
  level: z.enum(level).optional(),
  age_group: z.enum(age_group).optional(),
  official_match: z.boolean().optional(),
  transferurl: z.string().nonempty().optional(),
  sofaurl: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type CompetitionType = z.infer<typeof CompetitionZodSchema>;

export const CompetitionFormSchema = CompetitionZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const CompetitionResponseSchema = CompetitionZodSchema.extend({
  country: CountryZodSchema.optional(),
});

export const CompetitionPopulatedSchema = CompetitionZodSchema.extend({
  country: CountryZodSchema.optional(),
});
