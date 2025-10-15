import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";

export const StadiumZodSchema = z.object({
  name: z.string().nonempty(),
  abbr: z.string().optional(),
  en_name: z.string().optional(),
  alt_names: z.array(z.string()).optional(),
  alt_abbrs: z.array(z.string()).optional(),
  alt_en_names: z.array(z.string()).optional(),
  country: objectId.optional(),
  transferurl: z.string().optional(),
  sofaurl: z.string().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type StadiumType = z.infer<typeof StadiumZodSchema>;
export const StadiumZodSchemaArray = z.array(StadiumZodSchema);
