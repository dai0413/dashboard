import { z } from "zod";
import { objectId } from "./utils/objectId.ts";
import { dateField } from "./utils/dateField.ts";
import { age_group } from "../enum/age_group.ts";

export const NationalMatchSeriesZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  abbr: z.string().nonempty().optional(),
  country: objectId.refine((v) => !!v, { message: "countryは必須です" }),
  age_group: z.enum(age_group).optional(),
  matches: z.array(objectId).optional(),
  joined_at: dateField.optional(),
  left_at: dateField.optional(),
  urls: z.array(z.string().nonempty()).optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type NationalMatchSeriesType = z.infer<
  typeof NationalMatchSeriesZodSchema
>;

export const NationalMatchSeriesFormSchema = NationalMatchSeriesZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const NationalMatchSeriesResponseSchema = NationalMatchSeriesZodSchema;
