import { z } from "zod";
import { objectId } from "./utils/objectId.js";
import { dateField } from "./utils/dateField.js";
import { position } from "../enum/position.js";
import { form } from "../enum/form.js";
import { PlayerZodSchema } from "./player.schema.js";
import { TeamZodSchema } from "./team.schema.js";

export const TransferZodSchema = z
  .object({
    _id: objectId,
    doa: dateField.refine((v) => !!v, { message: "doaは必須です" }),
    from_team: objectId.optional(),
    from_team_name: z.string().nonempty().optional(),
    to_team: objectId.optional(),
    to_team_name: z.string().nonempty().optional(),
    player: objectId.refine((v) => !!v, { message: "playerは必須です" }),
    position: z.array(z.enum(position)).optional(),
    form: z.enum(form).optional(),
    number: z.number().optional(),
    from_date: dateField.refine((v) => !!v, { message: "from_dateは必須です" }),
    to_date: dateField,
    URL: z.array(z.string().nonempty()).optional(),
    createdAt: z
      .preprocess(
        (arg) => (typeof arg === "string" ? new Date(arg) : arg),
        z.date()
      )
      .optional(),
    updatedAt: z
      .preprocess(
        (arg) => (typeof arg === "string" ? new Date(arg) : arg),
        z.date()
      )
      .optional(),
  })
  .refine((data) => data.from_team || data.from_team_name, {
    message: "from_teamまたはfrom_team_nameのどちらかを入力してください",
  })
  .refine((data) => data.to_team || data.to_team_name, {
    message: "to_teamまたはto_team_nameのどちらかを入力してください",
  })
  .refine(
    (data) =>
      !data.to_date ||
      !data.from_date ||
      new Date(data.to_date) > new Date(data.from_date),
    { message: "to_dateはfrom_dateよりも後である必要があります" }
  );

export type TransferType = z.infer<typeof TransferZodSchema>;

export const TransferFormSchema = TransferZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const TransferResponseSchema = TransferZodSchema.omit({
  from_team_name: true,
  to_team_name: true,
}).extend({
  player: PlayerZodSchema.extend({ _id: objectId.optional() }),
  from_team: TeamZodSchema.extend({ _id: objectId.optional() }).optional(),
  to_team: TeamZodSchema.extend({ _id: objectId.optional() }).optional(),
});

export const TransferPopulatedSchema = TransferZodSchema.omit({
  player: true,
  from_team: true,
  to_team: true,
}).safeExtend({
  player: PlayerZodSchema,
  from_team: TeamZodSchema.extend({ _id: objectId.optional() }).optional(),
  to_team: TeamZodSchema.extend({ _id: objectId.optional() }).optional(),
});
