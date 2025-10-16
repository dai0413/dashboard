import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { objectId } from "./utils/objectId.ts";

const ttpPattern = /^(\d+)([dwmy])$|^(\d+)-(\d+)([dwmy])$/i;

export const InjuryZodSchema = z
  .object({
    _id: objectId,
    doa: dateField.refine((v) => !!v, { message: "doaは必須です" }),
    team: objectId.optional(),
    team_name: z.string().nonempty().optional(),
    now_team: objectId.optional(),
    player: objectId.refine((v) => !!v, { message: "playerは必須です" }),
    doi: dateField,
    dos: dateField,
    injured_part: z.array(z.string().nonempty()).optional(),
    is_injured: z.boolean().default(true),
    ttp: z
      .array(
        z
          .string()
          .regex(
            ttpPattern,
            "全治期間は 数字+単位（d/w/m/y）、または 数字+単位-数字+単位 の形式で入力してください（例: 3d, 10-14d, 1d-3w）"
          )
      )
      .optional(),
    erd: dateField.optional(),
    URL: z.array(z.string().nonempty()).optional(),
    createdAt: dateField,
    updatedAt: dateField,
  })
  .refine((data) => data.team || data.team_name, {
    message: "team または team_name のどちらかを入力してください",
  })
  .refine(
    (data) =>
      !data.erd ||
      (!data.doi && !data.dos) ||
      (data.doi && data.erd > data.doi) ||
      (data.dos && data.erd > data.dos),
    { message: "erd は doi または dos より後である必要があります" }
  );

export type InjuryType = z.infer<typeof InjuryZodSchema>;

export const InjuryFormSchema = InjuryZodSchema.omit({
  _id: true,
  erd: true,
  createdAt: true,
  updatedAt: true,
});

export const InjuryResponseSchema = InjuryZodSchema;
