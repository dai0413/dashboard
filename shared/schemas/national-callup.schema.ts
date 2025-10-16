import { z } from "zod";
import { objectId } from "./utils/objectId.ts";
import { dateField } from "./utils/dateField.ts";
import { position_group } from "../enum/position_group.ts";
import { status } from "../enum/status.ts";
import { left_reason } from "../enum/left_reason.ts";

export const NationalCallUpZodSchema = z
  .object({
    series: objectId.refine((v) => !!v, {
      message: "seriesは必須です",
    }),
    player: objectId.refine((v) => !!v, {
      message: "playerは必須です",
    }),
    team: objectId,
    team_name: z.string().nonempty().optional(),
    joined_at: dateField,
    left_at: dateField,
    number: z.number().optional(),
    position_group: z.enum(position_group).optional(),
    is_captain: z.boolean().default(false),
    is_overage: z.boolean().default(false),
    is_backup: z.boolean().default(false),
    is_training_partner: z.boolean().default(false),
    is_additional_call: z.boolean().default(false),
    status: z.enum(status).default("joined"),
    left_reason: z.enum(left_reason).optional(),
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
export const NationalCallUpZodSchemaArray = z.array(NationalCallUpZodSchema);
