import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { getKey } from "../utils/getKey.js";
import { event_type } from "../enum/event_type.js";

export const MatchEventTypeZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  en_name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "en_nameは必須です" }),
  abbr: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "abbrは必須です" }),
  event_type: z
    .enum(getKey(event_type()))
    .refine((v) => !!v, { message: "event_typeは必須です" }),
  createdAt: dateField,
  updatedAt: dateField,
});

export type MatchEventTypeType = z.infer<typeof MatchEventTypeZodSchema>;

export const MatchEventTypeFormSchema = MatchEventTypeZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const MatchEventTypeResponseSchema = MatchEventTypeZodSchema;

export const MatchEventTypePopulatedSchema = MatchEventTypeZodSchema;
