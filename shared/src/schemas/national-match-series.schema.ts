import { z } from "zod";
import { objectId } from "./utils/objectId.js";
import { dateField } from "./utils/dateField.js";
import { CountryZodSchema } from "./country.schema.js";
import { TeamZodSchema } from "./team.schema.js";
import { MatchBaseZodSchema } from "./match.schema.js";
import { label } from "./utils/label.js";

export const NationalMatchSeriesZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  abbr: z.string().nonempty().optional(),
  team: objectId.optional(),
  matches: z.array(objectId).optional(),
  joined_at: dateField.optional(),
  left_at: dateField.optional(),
  urls: z.array(z.string().nonempty()).optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const NationalMatchSeriesFormSchema = NationalMatchSeriesZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const NationalMatchSeriesResponseSchema =
  NationalMatchSeriesZodSchema.omit({
    team: true,
    matches: true,
  }).safeExtend({
    team: TeamZodSchema.optional(),
    matches: z.array(MatchBaseZodSchema).optional(),
  });

export const NationalMatchSeriesPopulatedSchema =
  NationalMatchSeriesZodSchema.omit({
    team: true,
    matches: true,
  }).safeExtend({
    team: TeamZodSchema.optional(),
    matches: z.array(MatchBaseZodSchema).optional(),
  });

export const NationalMatchSeriesPopulateLabelSchema =
  NationalMatchSeriesZodSchema.omit({
    team: true,
    matches: true,
  }).safeExtend({
    team: label,
    matches: z.array(label).optional(),
  });
