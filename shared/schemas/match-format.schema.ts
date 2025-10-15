import { z } from "zod";
import { dateField } from "./utils/dateField.ts";
import { period_label } from "../enum/period_label.ts";

const PeriodZodSchema = z
  .object({
    period_label: z.enum(period_label).refine((v) => !!v, {
      message: "period_labelは必須です",
    }),
    start: z.number().nullable(),
    end: z.number().nullable(),
    order: z.number().default(0),
  })
  .refine(
    (data) => {
      if (data.start == null || data.end == null) return true;
      return data.start <= data.end;
    },
    {
      message: "startはend以下である必要があります",
      path: ["start"], // エラー箇所を明示
    }
  );

export const MatchFormatZodSchema = z.object({
  name: z
    .string()
    .nonempty()
    .refine((v) => !!v, { message: "nameは必須です" }),
  period: z.array(PeriodZodSchema),
  createdAt: dateField,
  updatedAt: dateField,
});

export type MatchFormatType = z.infer<typeof MatchFormatZodSchema>;
export const MatchFormatZodSchemaArray = z.array(MatchFormatZodSchema);
