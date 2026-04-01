import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { RefereeZodSchema } from "./referee.schema.js";
import { MatchBaseZodSchema } from "./match.schema.js";
import { label } from "./utils/label.js";

export const RefereeAppearanceBaseZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, {
    message: "matchは必須です",
  }),
  referee: objectId.optional(),
  referee_name: z.string().nonempty().optional(),
  role: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const RefereeAppearanceZodSchema = RefereeAppearanceBaseZodSchema.refine(
  (data) => data.referee || data.referee_name,
  { message: "referee または referee_name のどちらかは必須" },
).refine((data) => !(data.referee && data.referee_name), {
  message: "referee と referee_name は同時に指定できません",
});

export type RefereeAppearanceType = z.infer<typeof RefereeAppearanceZodSchema>;

export const RefereeAppearanceFormSchema = RefereeAppearanceBaseZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const RefereeAppearanceResponseSchema =
  RefereeAppearanceBaseZodSchema.omit({
    match: true,
    referee: true,
  }).safeExtend({
    referee: RefereeZodSchema.extend({
      _id: objectId.optional(),
      normalized_en_name: z.string().optional(),
    }),
    match: MatchBaseZodSchema,
  });

export const RefereeAppearancePopulatedSchema =
  RefereeAppearanceBaseZodSchema.omit({
    match: true,
    referee: true,
  }).safeExtend({
    referee: RefereeZodSchema.optional(),
    match: MatchBaseZodSchema,
  });

export const RefereeAppearancePopulateLabelSchema =
  RefereeAppearanceBaseZodSchema.omit({
    match: true,
    referee: true,
  }).safeExtend({
    referee: label.optional(),
    match: label.optional(),
  });
