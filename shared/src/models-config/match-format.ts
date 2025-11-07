import z from "zod";
import {
  MatchFormatZodSchema,
  MatchFormatType,
  MatchFormatFormSchema,
  MatchFormatResponseSchema,
  MatchFormatPopulatedSchema,
} from "../schemas/match-format.schema.js";
import { ControllerConfig } from "../types.js";

export function matchFormat<TDoc = any, TModel = any>(
  mongoModel?: TModel
): ControllerConfig<
  TDoc,
  MatchFormatType,
  z.infer<typeof MatchFormatFormSchema>,
  z.infer<typeof MatchFormatResponseSchema>,
  z.infer<typeof MatchFormatPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "match-format",
    SCHEMA: {
      DATA: MatchFormatZodSchema,
      FORM: MatchFormatFormSchema,
      RESPONSE: MatchFormatResponseSchema,
      POPULATED: MatchFormatPopulatedSchema,
    },
    TYPE: {} as MatchFormatType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [],
    getAllConfig: {
      sort: { _id: 1 },
    },
    bulk: false,
    download: false,
    TEST: {
      sampleData: [
        {
          name: "90",
          period: [
            { period_label: "1H", start: 0, end: 45, order: 0 },
            { period_label: "2H", start: 45, end: 90, order: 0 },
          ],
        },
        {
          name: "90+PK",
          period: [
            { period_label: "1H", start: 0, end: 45, order: 0 },
            { period_label: "2H", start: 45, end: 90, order: 0 },
            { period_label: "PK", order: 0 },
          ],
        },
        {
          name: "90+15",
          period: [
            { period_label: "1H", start: 0, end: 45, order: 0 },
            { period_label: "2H", start: 45, end: 90, order: 0 },
            { period_label: "EX1", start: 90, end: 105, order: 0 },
          ],
        },
      ],
      updatedData: {
        name: "updated_name",
      },
    },
  };
}
