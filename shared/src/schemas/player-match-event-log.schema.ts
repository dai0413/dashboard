import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { getKey } from "../utils/getKey.js";
import { periodLabel } from "../enum/period-label.js";
import { special_time } from "../enum/special_time.js";
import { MatchBaseZodSchema } from "./match.schema.js";
import { TeamZodSchema } from "./team.schema.js";
import { MatchEventTypeZodSchema } from "./match-event-type.schema.js";
import { PlayerZodSchema } from "./player.schema.js";

const SPECIAL_TIME_ENUM = z.enum(getKey(special_time()));
const PERIOD_LABEL_ENUM = z.enum(getKey(periodLabel()));

export const PlayerMatchEventLogBaseZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, { message: "matchは必須です" }),
  team: objectId.refine((v) => !!v, { message: "teamは必須です" }),
  match_event_type: objectId.refine((v) => !!v, {
    message: "match_event_typeは必須です",
  }),
  player: objectId.optional(),
  player_name: z.string().nonempty().optional(),
  time: z.number().int().min(0).optional(),
  add_time: z.number().int().positive().optional(),
  special_time: SPECIAL_TIME_ENUM.optional(),
  period_label: PERIOD_LABEL_ENUM.optional(),
  time_name: z.string().nonempty().optional(),
  order: z.number().int().positive().optional(),
  unique_key: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "unique_keyは必須です" }),
  createdAt: dateField,
  updatedAt: dateField,
});

export const PlayerMatchEventLogZodSchema =
  PlayerMatchEventLogBaseZodSchema.refine(
    (d) => {
      // order 入力時は time, add_time, special_time が undefined

      if (d.order == null) return true;
      return d.time == null && d.add_time == null && d.special_time == null;
    },
    {
      message:
        "order を入力する場合は time, add_time, special_time を指定できません",
    },
  )

    // special_time 入力時は time, add_time, order が undefined
    .refine(
      (d) => {
        if (d.special_time == null) return true;
        return d.time == null && d.add_time == null && d.order == null;
      },
      {
        message:
          "special_time を入力する場合は time, add_time, order を指定できません",
      },
    )
    .refine((data) => data.player || data.player_name, {
      message: "playerまたはplayer_nameのどちらかを入力してください",
    });

export type PlayerMatchEventLogType = z.infer<
  typeof PlayerMatchEventLogZodSchema
>;

export const PlayerMatchEventLogFormSchema =
  PlayerMatchEventLogBaseZodSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
    unique_key: true,
  });

export const PlayerMatchEventLogResponseSchema =
  PlayerMatchEventLogBaseZodSchema.omit({
    match: true,
    team: true,
    match_event_type: true,
    player: true,
  }).safeExtend({
    match: MatchBaseZodSchema,
    team: TeamZodSchema,
    match_event_type: MatchEventTypeZodSchema,
    player: PlayerZodSchema.extend({ _id: objectId.optional() }),
  });

export const PlayerMatchEventLogPopulatedSchema =
  PlayerMatchEventLogBaseZodSchema.omit({
    match: true,
    team: true,
    match_event_type: true,
    player: true,
  }).safeExtend({
    match: MatchBaseZodSchema,
    team: TeamZodSchema,
    match_event_type: MatchEventTypeZodSchema,
    player: PlayerZodSchema.optional(),
  });
