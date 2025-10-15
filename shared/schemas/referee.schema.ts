import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";

export const RefereeZodSchema = z.object({
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  en_name: z.string().nonempty().optional(),
  dob: dateField,
  pob: z.string().nonempty().optional(),
  citizenship: z.array(objectId),
  player: objectId.optional(),
  transferurl: z.string().nonempty().optional(),
  sofaurl: z.string().nonempty().optional(),

  createdAt: dateField,
  updatedAt: dateField,
});

export type RefereeType = z.infer<typeof RefereeZodSchema>;
export const RefereeZodSchemaArray = z.array(RefereeZodSchema);
