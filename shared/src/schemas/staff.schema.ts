import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";

export const StaffZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  en_name: z.string().nonempty().optional(),
  dob: dateField,
  pob: z.string().nonempty().optional(),
  player: objectId.optional(),
  old_id: z.string().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type StaffType = z.infer<typeof StaffZodSchema>;

export const StaffFormSchema = StaffZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const StaffResponseSchema = StaffZodSchema;

export const StaffPopulatedSchema = StaffZodSchema;
