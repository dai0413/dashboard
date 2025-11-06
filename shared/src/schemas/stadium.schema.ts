import { z } from "zod";
import { dateField } from "./utils/dateField";
import { objectId } from "./utils/objectId";
import { CountryZodSchema } from "./country.schema";

export const StadiumZodSchema = z.object({
  _id: objectId,
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

export const StadiumFormSchema = StadiumZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const StadiumResponseSchema = StadiumZodSchema.extend({
  country: CountryZodSchema.optional(),
});

export const StadiumPopulatedSchema = StadiumZodSchema.extend({
  country: CountryZodSchema.optional(),
});
