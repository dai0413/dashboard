import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { getKey } from "../utils/getKey.js";
import { area } from "../enum/area.js";
import { district } from "../enum/district.js";
import { confederation } from "../enum/confederation.js";
import { subConfederation } from "../enum/subConfederation.js";

export const CountryZodSchema = z.object({
  _id: objectId,
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  en_name: z.string().nonempty().optional(),
  iso3: z
    .string()
    .nonempty()
    .optional()
    .transform((val) => val?.toUpperCase()),
  fifa_code: z
    .string()
    .nonempty()
    .optional()
    .transform((val) => val?.toUpperCase()),
  area: z.enum(getKey(area())).optional(),
  district: z.enum(getKey(district())).optional(),
  confederation: z.enum(getKey(confederation())).optional(),
  sub_confederation: z.enum(getKey(subConfederation())).optional(),
  established_year: z.number().optional(),
  fifa_member_year: z.number().optional(),
  association_member_year: z.number().optional(),
  district_member_year: z.number().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type CountryType = z.infer<typeof CountryZodSchema>;

export const CountryFormSchema = CountryZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const CountryResponseSchema = CountryZodSchema;

export const CountryPopulatedSchema = CountryZodSchema;
