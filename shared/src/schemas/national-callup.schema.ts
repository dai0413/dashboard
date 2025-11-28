import { z } from "zod";
import { objectId } from "./utils/objectId.js";
import { dateField } from "./utils/dateField.js";
import { positionGroup } from "../enum/positionGroup.js";
import { status } from "../enum/status.js";
import { leftReason } from "../enum/leftReason.js";
import { PlayerZodSchema } from "./player.schema.js";
import { NationalMatchSeriesZodSchema } from "./national-match-series.schema.js";
import { TeamZodSchema } from "./team.schema.js";
import { getKey } from "../utils/getKey.js";

export const NationalCallUpZodSchema = z
  .object({
    _id: objectId,
    series: objectId.refine((v) => !!v, {
      message: "seriesは必須です",
    }),
    player: objectId.refine((v) => !!v, {
      message: "playerは必須です",
    }),
    team: objectId.optional(),
    team_name: z.string().nonempty().optional(),
    joined_at: dateField,
    left_at: dateField,
    number: z.number().optional(),
    position_group: z.enum(getKey(positionGroup())).optional(),
    is_captain: z.boolean().default(false),
    is_overage: z.boolean().default(false),
    is_backup: z.boolean().default(false),
    is_training_partner: z.boolean().default(false),
    is_additional_call: z.boolean().default(false),
    status: z.enum(getKey(status())).default("joined"),
    left_reason: z.enum(getKey(leftReason())).optional(),
    createdAt: dateField,
    updatedAt: dateField,
  })
  .refine((data) => data.team || data.team_name, {
    message: "teamまたはteam_nameのどちらかを入力してください",
  })
  .refine(
    (data) => {
      if (data.status === "declined") {
        return !data.joined_at && !data.left_at;
      }
      return true;
    },
    {
      message:
        "statusがdeclinedのときはjoined_atとleft_atはundefinedでなければならない",
    }
  );

export type NationalCallUpType = z.infer<typeof NationalCallUpZodSchema>;

export const NationalCallUpFormSchema = NationalCallUpZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const NationalCallUpResponseSchema = NationalCallUpZodSchema.omit({
  series: true,
  player: true,
  team: true,
  team_name: true,
}).safeExtend({
  series: NationalMatchSeriesZodSchema,
  player: PlayerZodSchema,
  team: TeamZodSchema.extend({ _id: objectId.optional() }).optional(),
});

export const NationalCallUpPopulatedSchema = NationalCallUpZodSchema.omit({
  series: true,
  player: true,
  team: true,
}).safeExtend({
  series: NationalMatchSeriesZodSchema,
  player: PlayerZodSchema,
  team: TeamZodSchema.extend({ _id: objectId.optional() }).optional(),
});
