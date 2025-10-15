import { z } from "zod";
import { dateField } from "./utils/dateField.ts";

export const PlayerZodSchema = z.object({
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
export const PlayerZodSchemaArray = z.array(PlayerZodSchema);
