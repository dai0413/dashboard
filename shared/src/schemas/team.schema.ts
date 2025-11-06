import { z } from "zod";
import { objectId } from "./utils/objectId";
import { genre } from "../enum/genre";
import { age_group } from "../enum/age_group";
import { division } from "../enum/division";
import { CountryZodSchema } from "./country.schema";

export const TeamZodSchema = z.object({
  _id: objectId,
  team: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "teamは必須です" }),
  abbr: z.string().nonempty().optional(),
  enTeam: z.string().nonempty().optional(),
  country: objectId.optional(),
  genre: z.enum(genre).optional(),
  age_group: z.enum(age_group).optional(),
  division: z.enum(division).default("1st").optional(),
  jdataid: z.number().optional(),
  labalph: z.string().optional(),
  transferurl: z.string().nonempty().optional(),
  sofaurl: z.string().nonempty().optional(),
  createdAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  updatedAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
});

export type TeamType = z.infer<typeof TeamZodSchema>;

export const TeamFormSchema = TeamZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const TeamResponseSchema = TeamZodSchema.extend({
  country: CountryZodSchema.optional(),
});

export const TeamPopulatedSchema = TeamZodSchema.extend({
  country: CountryZodSchema.optional(),
});
