import z from "zod";
import { MatchFormatModel, IMatchFormat } from "../mongose/match-format.ts";
import {
  MatchFormatZodSchema,
  MatchFormatType,
  MatchFormatFormSchema,
  MatchFormatResponseSchema,
  MatchFormatPopulatedSchema,
} from "../schemas/match-format.schema.ts";
import { ControllerConfig } from "../types.ts";

export const matchFormat: ControllerConfig<
  IMatchFormat,
  MatchFormatType,
  z.infer<typeof MatchFormatFormSchema>,
  z.infer<typeof MatchFormatResponseSchema>,
  z.infer<typeof MatchFormatPopulatedSchema>
> = {
  name: "match-format",
  SCHEMA: {
    DATA: MatchFormatZodSchema,
    FORM: MatchFormatFormSchema,
    RESPONSE: MatchFormatResponseSchema,
    POPULATED: MatchFormatPopulatedSchema,
  },
  TYPE: {} as MatchFormatType,
  MONGO_MODEL: MatchFormatModel,
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
