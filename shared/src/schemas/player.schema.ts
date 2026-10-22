import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { CountryZodSchema } from "./country.schema.js";
import { label } from "./utils/label.js";

export const PlayerZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  en_name: z.string().nonempty().optional(),
  dob: dateField,
  citizenship: z.array(objectId).optional(),
  pob: z.string().nonempty().optional(),
  old_id: z.string().optional(),
  normalized_en_name: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const PlayerFormSchema = PlayerZodSchema.omit({
  _id: true,
  normalized_en_name: true,
  createdAt: true,
  updatedAt: true,
});

export const PlayerResponseSchema = PlayerZodSchema.extend({
  citizenship: z.array(CountryZodSchema).default([]).optional(),
});

export const PlayerPopulatedSchema = PlayerZodSchema.extend({
  citizenship: z.array(CountryZodSchema).default([]).optional(),
});

export const PlayerPopulateLabelSchema = PlayerZodSchema.extend({
  citizenship: z.array(label).default([]).optional(),
});
