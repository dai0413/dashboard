import { z } from "zod";
import { competition_type } from "../enum/competition_type.ts";
import { objectId } from "./utils/objectId.ts";
import { category } from "../enum/category.ts";
import { level } from "../enum/level.ts";
import { age_group } from "../enum/age_group.ts";
import { dateField } from "./utils/dateField.ts";

export const CompetitionZodSchema = z.object({
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
export const CompetitionZodSchemaArray = z.array(CompetitionZodSchema);
