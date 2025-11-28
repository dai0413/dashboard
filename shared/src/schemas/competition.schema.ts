import { z } from "zod";
import { getKey } from "../utils/getKey.js";
import { competitionType } from "../enum/competition_type.js";
import { objectId } from "./utils/objectId.js";
import { category } from "../enum/category.js";
import { level } from "../enum/level.js";
import { ageGroup } from "../enum/ageGroup.js";
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
  competition_type: z.enum(getKey(competitionType())).optional(),
  category: z.enum(getKey(category())).optional(),
  level: z.enum(getKey(level())).optional(),
  age_group: z.enum(getKey(ageGroup())).optional(),
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
