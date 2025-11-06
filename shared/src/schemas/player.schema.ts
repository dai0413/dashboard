import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";

export const PlayerZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  en_name: z.string().nonempty().optional(),
  dob: dateField,
  pob: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type PlayerType = z.infer<typeof PlayerZodSchema>;

export const PlayerFormSchema = PlayerZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const PlayerResponseSchema = PlayerZodSchema;

export const PlayerPopulatedSchema = PlayerZodSchema;
