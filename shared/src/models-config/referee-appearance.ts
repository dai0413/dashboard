import z from "zod";
import {
  RefereeAppearanceZodSchema,
  RefereeAppearanceType,
  RefereeAppearanceFormSchema,
  RefereeAppearanceResponseSchema,
  RefereeAppearancePopulatedSchema,
} from "../schemas/referee-appearance.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { refereeAppearance as convertFun } from "../utils/format/referee-appearance.js";
import { ParsedQs } from "qs";

export function refereeAppearance<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  TDoc,
  RefereeAppearanceType,
  z.infer<typeof RefereeAppearanceFormSchema>,
  z.infer<typeof RefereeAppearanceResponseSchema>,
  z.infer<typeof RefereeAppearancePopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "referee-appearance",
    collection_name: "refereeappearances",
    SCHEMA: {
      DATA: RefereeAppearanceZodSchema,
      FORM: RefereeAppearanceFormSchema,
      RESPONSE: RefereeAppearanceResponseSchema,
      POPULATED: RefereeAppearancePopulatedSchema,
    },
    TYPE: {} as RefereeAppearanceType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matches" },
      { path: "referee", collection: "referees" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "referee", type: "ObjectId" },
        { field: "role", type: "String" },
      ],
      sort: { _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          match: deps.match[0]._id,
          referee: deps.referee[0]._id,
          role: "referee",
        },
      ],
      updatedData: {
        role: "avar",
      },
    },
    convertFun: convertFun,
  };
}
