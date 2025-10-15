import { z } from "zod";
import { objectId } from "./utils/objectId.ts";
import { genre } from "../enum/genre.ts";
import { age_group } from "../enum/age_group.ts";
import { division } from "../enum/division.ts";

export const TeamZodSchema = z.object({
  team: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "teamは必須です" }),
  abbr: z.string().nonempty().optional(),
  enTeam: z.string().nonempty().optional(),
  country: objectId.optional(),
  genre: z.enum(genre).optional(),
  age_group: z.enum(age_group).optional(),
  division: z.enum(division).default("1st"),
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
export const TeamZodSchemaArray = z.array(TeamZodSchema);
