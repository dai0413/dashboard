import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { MatchZodSchema } from "./match.schema.js";
import { PlayerZodSchema } from "./player.schema.js";
import { TeamZodSchema } from "./team.schema.js";

export const StaffAppearanceZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, {
    message: "matchは必須です",
  }),
  staff: objectId.refine((v) => !!v, {
    message: "staffは必須です",
  }),
  team: objectId.refine((v) => !!v, {
    message: "teamは必須です",
  }),
  role: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type StaffAppearanceType = z.infer<typeof StaffAppearanceZodSchema>;

export const StaffAppearanceFormSchema = StaffAppearanceZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const StaffAppearanceResponseSchema = StaffAppearanceZodSchema.omit({
  match: true,
  staff: true,
  team: true,
}).safeExtend({
  match: MatchZodSchema,
  staff: PlayerZodSchema,
  team: TeamZodSchema,
});

export const StaffAppearancePopulatedSchema = StaffAppearanceZodSchema.omit({
  match: true,
  staff: true,
  team: true,
}).safeExtend({
  match: MatchZodSchema,
  staff: PlayerZodSchema,
  team: TeamZodSchema,
});
