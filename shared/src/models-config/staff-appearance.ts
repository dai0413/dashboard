import {
  StaffAppearanceZodSchema,
  StaffAppearanceFormSchema,
  StaffAppearanceResponseSchema,
  StaffAppearancePopulatedSchema,
} from "../schemas/staff-appearance.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { staffAppearance as convertFun } from "../utils/format/staff-appearance.js";
import { ParsedQs } from "qs";

export function staffAppearance<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof StaffAppearanceZodSchema,
  typeof StaffAppearanceFormSchema,
  typeof StaffAppearanceResponseSchema,
  typeof StaffAppearancePopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "staff-appearance",
    collection_name: "staffappearances",
    SCHEMA: {
      DATA: StaffAppearanceZodSchema,
      FORM: StaffAppearanceFormSchema,
      RESPONSE: StaffAppearanceResponseSchema,
      POPULATED: StaffAppearancePopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matches" },
      { path: "staff", collection: "staffs" },
      { path: "team", collection: "teams" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "staff", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
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
          staff: deps.staff[0]._id,
          team: deps.team[0]._id,
          role: "head",
        },
      ],
      updatedData: {
        role: "analyst",
      },
    },
    convertFun: convertFun,
  };
}
