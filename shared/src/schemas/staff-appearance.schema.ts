import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { MatchBaseZodSchema } from "./match.schema.js";
import { StaffZodSchema } from "./staff.schema.js";
import { TeamZodSchema } from "./team.schema.js";
import { label } from "./utils/label.js";

export const StaffAppearanceBaseZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, {
    message: "matchは必須です",
  }),
  staff: objectId.optional(),
  staff_name: z.string().nonempty().optional(),
  team: objectId.refine((v) => !!v, {
    message: "teamは必須です",
  }),
  role: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const StaffAppearanceZodSchema = StaffAppearanceBaseZodSchema.refine(
  (data) => data.staff || data.staff_name,
  { message: "staff または staff_name のどちらかは必須" },
).refine((data) => !(data.staff && data.staff_name), {
  message: "staff と staff_name は同時に指定できません",
});

export const StaffAppearanceFormSchema = StaffAppearanceBaseZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const StaffAppearanceResponseSchema = StaffAppearanceBaseZodSchema.omit({
  match: true,
  staff: true,
  team: true,
}).safeExtend({
  match: MatchBaseZodSchema,
  staff: StaffZodSchema.extend({
    _id: objectId.optional(),
    normalized_en_name: z.string().optional(),
  }),
  team: TeamZodSchema,
});

export const StaffAppearancePopulatedSchema = StaffAppearanceBaseZodSchema.omit(
  {
    match: true,
    staff: true,
    team: true,
  },
).safeExtend({
  match: MatchBaseZodSchema,
  staff: StaffZodSchema.optional(),
  team: TeamZodSchema,
});

export const StaffAppearancePopulateLabelSchema =
  StaffAppearanceBaseZodSchema.omit({
    match: true,
    staff: true,
    team: true,
  }).safeExtend({
    match: label.optional(),
    staff: label.optional(),
    team: label.optional(),
  });
