import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";
import { PlayerZodSchema } from "./player.schema.ts";
import { CountryZodSchema } from "./country.schema.ts";

export const RefereeZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  en_name: z.string().nonempty().optional(),
  dob: dateField,
  pob: z.string().nonempty().optional(),
  citizenship: z.array(objectId).optional(),
  player: objectId.optional(),
  transferurl: z.string().nonempty().optional(),
  sofaurl: z.string().nonempty().optional(),

  createdAt: dateField,
  updatedAt: dateField,
});

export type RefereeType = z.infer<typeof RefereeZodSchema>;

export const RefereeFormSchema = RefereeZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const RefereeResponseSchema = RefereeZodSchema.extend({
  citizenship: z.array(CountryZodSchema).default([]),
  player: PlayerZodSchema.optional(),
});

export const RefereePopulatedSchema = RefereeZodSchema.extend({
  citizenship: z.array(CountryZodSchema).default([]),
  player: PlayerZodSchema.optional(),
});
