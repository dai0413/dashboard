import {
  MatchEventTypeZodSchema,
  MatchEventTypeFormSchema,
  MatchEventTypeResponseSchema,
  MatchEventTypePopulatedSchema,
} from "../schemas/match-event-type.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function matchEventType<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof MatchEventTypeZodSchema,
  typeof MatchEventTypeFormSchema,
  typeof MatchEventTypeResponseSchema,
  typeof MatchEventTypePopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "match-event-type",
    collection_name: "matcheventtypes",
    SCHEMA: {
      DATA: MatchEventTypeZodSchema,
      FORM: MatchEventTypeFormSchema,
      RESPONSE: MatchEventTypeResponseSchema,
      POPULATED: MatchEventTypePopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [],
    getAllConfig: {
      query: [
        { field: "name", type: "String" },
        { field: "en_name", type: "String" },
        { field: "event_type", type: "String" },
      ],
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: [
        {
          name: "イエローカード",
          en_name: "yellow",
          abbr: "yel",
          event_type: "card",
        },
        {
          name: "レッドカード",
          en_name: "red",
          abbr: "red",
          event_type: "card",
        },
        {
          name: "得点",
          en_name: "goal",
          abbr: "goal",
          event_type: "goal-assist",
        },
      ],
      updatedData: {
        abbr: "updated_abbr",
      },
    },
  };
}
