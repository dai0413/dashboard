import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { position } from "../enum/position.js";
import { getKey } from "../utils/getKey.js";
import { play_status } from "../enum/play_status.js";
import { PlayerZodSchema } from "./player.schema.js";
import { MatchBaseZodSchema } from "./match.schema.js";
import { TeamZodSchema } from "./team.schema.js";

export const PlayerAppearanceBaseZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, {
    message: "matchは必須です",
  }),
  player: objectId.optional(),
  player_name: z.string().nonempty().optional(),
  team: objectId.refine((v) => !!v, {
    message: "teamは必須です",
  }),
  number: z.number().int().positive().optional(),
  play_status: z.enum(getKey(play_status())).optional(),
  position: z.enum(getKey(position())).optional(),
  time: z.number().int().min(0).optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const PlayerAppearanceZodSchema = PlayerAppearanceBaseZodSchema.refine(
  (data) => data.player || data.player_name,
  { message: "player または player_name のどちらかは必須" },
)
  .refine((data) => !(data.player && data.player_name), {
    message: "player と player_name は同時に指定できません",
  })
  .refine((d) => d.play_status !== "bench" || d.time === undefined, {
    message: "bench の場合、time は指定できません",
  })
  .refine((d) => d.play_status !== "bench" || d.position === undefined, {
    message: "bench の場合 position は指定できません",
  });

export type PlayerAppearanceType = z.infer<typeof PlayerAppearanceZodSchema>;

export const PlayerAppearanceFormSchema = PlayerAppearanceZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const PlayerAppearanceResponseSchema = PlayerAppearanceZodSchema.omit({
  match: true,
  player: true,
  team: true,
}).safeExtend({
  player: PlayerZodSchema,
  match: MatchBaseZodSchema,
  team: TeamZodSchema,
});

export const PlayerAppearancePopulatedSchema = PlayerAppearanceZodSchema.omit({
  match: true,
  player: true,
  team: true,
}).safeExtend({
  player: PlayerZodSchema,
  match: MatchBaseZodSchema,
  team: TeamZodSchema,
});
