import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { position } from "../enum/position.js";
import { getKey } from "../utils/getKey.js";
import { play_status } from "../enum/play_status.js";

export const PlayerAppearanceZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, {
    message: "matchは必須です",
  }),
  player: objectId.refine((v) => !!v, {
    message: "playerは必須です",
  }),
  team: objectId.refine((v) => !!v, {
    message: "teamは必須です",
  }),
  number: z.number().optional(),
  play_status: z.enum(getKey(play_status())).optional(),
  position: z.enum(getKey(position())).optional(),
  time: z.number().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export type PlayerAppearanceType = z.infer<typeof PlayerAppearanceZodSchema>;

export const PlayerAppearanceFormSchema = PlayerAppearanceZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const PlayerAppearanceResponseSchema = PlayerAppearanceZodSchema;

export const PlayerAppearancePopulatedSchema = PlayerAppearanceZodSchema;
