import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";
import { CompetitionZodSchema } from "./competition.schema.ts";

export const SeasonZodSchema = z.object({
  _id: objectId,
  competition: objectId.refine((v) => !!v, {
    message: "competitionは必須です",
  }),
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  start_date: dateField,
  end_date: dateField,
  current: z.boolean().optional(),
  note: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type SeasonType = z.infer<typeof SeasonZodSchema>;

export const SeasonFormSchema = SeasonZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const SeasonResponseSchema = SeasonZodSchema.extend({
  competition: CompetitionZodSchema,
});

export const SeasonPopulatedSchema = SeasonZodSchema.extend({
  competition: CompetitionZodSchema,
});
