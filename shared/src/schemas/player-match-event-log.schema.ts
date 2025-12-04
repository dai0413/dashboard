import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { getKey } from "../utils/getKey.js";
import { periodLabel } from "../enum/period-label.js";
import { special_time } from "../enum/special_time.js";

const SPECIAL_TIME_ENUM = z.enum(getKey(special_time()));
const PERIOD_LABEL_ENUM = z.enum(getKey(periodLabel()));

export const PlayerMatchEventLogZodSchema = z
  .object({
    _id: objectId,
    match: objectId.refine((v) => !!v, { message: "matchは必須です" }),
    team: objectId.refine((v) => !!v, { message: "teamは必須です" }),
    matchEventType: objectId.refine((v) => !!v, { message: "staffは必須です" }),
    player: objectId.optional(),
    player_name: z.string().nonempty().optional(),
    time: z.number().optional(),
    add_time: z.number().optional(),
    special_time: SPECIAL_TIME_ENUM.optional(),
    period_label: PERIOD_LABEL_ENUM.optional(),
    time_name: z.string().nonempty().optional(),
    order: z.number().optional(),
    createdAt: dateField,
    updatedAt: dateField,
  })

  // order 入力時は time, add_time, special_time が undefined
  .refine(
    (d) => {
      if (d.order == null) return true;
      return d.time == null && d.add_time == null && d.special_time == null;
    },
    {
      message:
        "order を入力する場合は time, add_time, special_time を指定できません",
    }
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
    }
  );

export type PlayerMatchEventLogType = z.infer<
  typeof PlayerMatchEventLogZodSchema
>;

export const PlayerMatchEventLogFormSchema = PlayerMatchEventLogZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  period_label: true,
  time_name: true,
});

export const PlayerMatchEventLogResponseSchema = PlayerMatchEventLogZodSchema;

export const PlayerMatchEventLogPopulatedSchema = PlayerMatchEventLogZodSchema;
