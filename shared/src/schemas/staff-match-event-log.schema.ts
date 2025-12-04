import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { getKey } from "../utils/getKey.js";
import { periodLabel } from "../enum/period-label.js";
import { special_time } from "../enum/special_time.js";

const SPECIAL_TIME_ENUM = z.enum(getKey(special_time()));
const PERIOD_LABEL_ENUM = z.enum(getKey(periodLabel()));

export const StaffMatchEventLogZodSchema = z
  .object({
    _id: objectId,
    match: objectId.refine((v) => !!v, { message: "matchは必須です" }),
    team: objectId.refine((v) => !!v, { message: "teamは必須です" }),
    matchEventType: objectId.refine((v) => !!v, { message: "staffは必須です" }),
    staff: objectId.optional(),
    staff_name: z.string().nonempty().optional(),
    time: z.number().optional(),
    add_time: z.number().optional(),
    special_time: SPECIAL_TIME_ENUM.optional(),
    period_label: PERIOD_LABEL_ENUM.optional(),
    time_name: z.string().nonempty().optional(),
    createdAt: dateField,
    updatedAt: dateField,
  }) // staff or staff_name どちらか必須
  .refine(
    (d) => {
      return !!d.staff || !!d.staff_name;
    },
    { message: "staff または staff_name が必要です" }
  )

  // special_time 入力時は time, add_time, order が undefined
  .refine(
    (d) => {
      if (d.special_time == null) return true;
      return d.time == null && d.add_time == null;
    },
    {
      message:
        "special_time を入力する場合は time, add_time, order を指定できません",
    }
  );

export type StaffMatchEventLogType = z.infer<
  typeof StaffMatchEventLogZodSchema
>;

export const StaffMatchEventLogFormSchema = StaffMatchEventLogZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  period_label: true,
  time_name: true,
});

export const StaffMatchEventLogResponseSchema = StaffMatchEventLogZodSchema;

export const StaffMatchEventLogPopulatedSchema = StaffMatchEventLogZodSchema;
