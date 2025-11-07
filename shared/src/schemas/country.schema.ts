// import { z } from "zod";
// import { dateField } from "./utils/dateField";
// import { objectId } from "./utils/objectId";
// import { area } from "../enum/area";
// import { district } from "../enum/district";
// import { confederation } from "../enum/confederation";
// import { sub_confederation } from "../enum/sub_confederation";

// export const CountryZodSchema = z.object({
//   _id: objectId,
//   name: z
//     .string()
//     .nonempty()
//     .refine((v) => !!v, { message: "nameは必須です" }),
//   en_name: z.string().nonempty().optional(),
//   iso3: z
//     .string()
//     .nonempty()
//     .optional()
//     .transform((val) => val?.toUpperCase()),
//   fifa_code: z
//     .string()
//     .nonempty()
//     .optional()
//     .transform((val) => val?.toUpperCase()),
//   area: z.enum(area).optional(),
//   district: z.enum(district).optional(),
//   confederation: z.enum(confederation).optional(),
//   sub_confederation: z.enum(sub_confederation).optional(),
//   established_year: z.number().optional(),
//   fifa_member_year: z.number().optional(),
//   association_member_year: z.number().optional(),
//   district_member_year: z.number().optional(),
//   createdAt: dateField,
//   updatedAt: dateField,
// });

// export type CountryType = z.infer<typeof CountryZodSchema>;

// export const CountryFormSchema = CountryZodSchema.omit({
//   _id: true,
//   createdAt: true,
//   updatedAt: true,
// });

// export const CountryResponseSchema = CountryZodSchema;

// export const CountryPopulatedSchema = CountryZodSchema;
