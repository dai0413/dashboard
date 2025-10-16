import z from "zod";
import {
  MatchFormatModel,
  IMatchFormat,
} from "../../server/models/match-format.ts";
import {
  MatchFormatZodSchema,
  MatchFormatType,
  MatchFormatFormSchema,
  MatchFormatResponseSchema,
} from "../schemas/match-format.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";
import { createPath } from "../../server/modelsConfig/utils/createPath.ts";

export const matchFormat: ControllerConfig<
  IMatchFormat,
  MatchFormatType,
  z.infer<typeof MatchFormatFormSchema>,
  z.infer<typeof MatchFormatResponseSchema>
> = {
  name: "match-format",
  SCHEMA: {
    DATA: MatchFormatZodSchema,
    FORM: MatchFormatFormSchema,
    RESPONSE: MatchFormatResponseSchema,
  },
  TYPE: {} as MatchFormatType,
  MONGO_MODEL: MatchFormatModel,
  POPULATE_PATHS: [],
  getALL: {
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
    testDataPath: createPath("player"),
  },
};
