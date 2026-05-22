import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { getKey } from "../utils/getKey.js";
import { position_formation } from "../enum/position_formation.js";

const POSITION_ENUM = z.enum(getKey(position_formation()));

export const FormationZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  position_formation: z
    .array(POSITION_ENUM)
    .length(11, "position_formation は11個である必要があります")
    .refine((arr) => new Set(arr).size === 11, {
      message: "position_formation 内の重複は許可されません",
    }),
  key: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "keyは必須です" }),
  old_id: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const FormationFormSchema = FormationZodSchema.omit({
  _id: true,
  key: true,
  createdAt: true,
  updatedAt: true,
});

export const FormationResponseSchema = FormationZodSchema;

export const FormationPopulatedSchema = FormationZodSchema;

export const FormationPopulateLabelSchema = FormationZodSchema;
