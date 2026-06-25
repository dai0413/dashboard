import {
  NationalCallUpZodSchema,
  NationalCallUpFormSchema,
  NationalCallUpResponseSchema,
  NationalCallUpPopulatedSchema,
} from "../schemas/national-callup.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { nationalCallup as convertFun } from "../utils/format/national-callup.js";
import { ParsedQs } from "qs";

export function nationalCallUp<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof NationalCallUpZodSchema,
  typeof NationalCallUpFormSchema,
  typeof NationalCallUpResponseSchema,
  typeof NationalCallUpPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "national-callup",
    collection_name: "nationalcallups",
    SCHEMA: {
      DATA: NationalCallUpZodSchema,
      FORM: NationalCallUpFormSchema,
      RESPONSE: NationalCallUpResponseSchema,
      POPULATED: NationalCallUpPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      {
        path: "series",
        collection: "nationalmatchseries",
      },
      { path: "player", collection: "players" },
      { path: "team", collection: "teams" },
    ],
    getAllConfig: {
      query: [
        { field: "player", type: "ObjectId" },
        { field: "series", type: "ObjectId" },
        { field: "series.country", type: "ObjectId", populateAfter: true },
        { field: "series.team", type: "ObjectId" },
      ],
      sort: {
        series: -1,
        position_group_order: 1,
        number: 1,
        _id: -1,
      },
      project: { position_group_order: 0 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          series: deps.nationalMatchSeries[0]._id,
          player: deps.player[0]._id,
          team: deps.team[0]._id,
          is_captain: false,
          is_overage: false,
          is_backup: false,
          is_training_partner: false,
          is_additional_call: false,
          status: "joined",
        },
      ],
      updatedData: {
        is_captain: true,
      },
    },
    convertFun: convertFun,
  };
}
