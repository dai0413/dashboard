import z from "zod";
import {
  StaffRegistrationHistoryZodSchema,
  StaffRegistrationHistoryType,
  StaffRegistrationHistoryFormSchema,
  StaffRegistrationHistoryResponseSchema,
  StaffRegistrationHistoryPopulatedSchema,
} from "../schemas/staff-registration-history.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function staffRegistrationHistory<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  TDoc,
  StaffRegistrationHistoryType,
  z.infer<typeof StaffRegistrationHistoryFormSchema>,
  z.infer<typeof StaffRegistrationHistoryResponseSchema>,
  z.infer<typeof StaffRegistrationHistoryPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "staff-registration-history",
    collection_name: "staffregistrationhistories",
    SCHEMA: {
      DATA: StaffRegistrationHistoryZodSchema,
      FORM: StaffRegistrationHistoryFormSchema,
      RESPONSE: StaffRegistrationHistoryResponseSchema,
      POPULATED: StaffRegistrationHistoryPopulatedSchema,
    },
    TYPE: {} as StaffRegistrationHistoryType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "season", collection: "seasons" },
      { path: "competition", collection: "competitions" },
      { path: "staff", collection: "staffs" },
      { path: "team", collection: "teams" },
    ],
    getAllConfig: {
      query: [
        { field: "season", type: "ObjectId" },
        { field: "competition", type: "ObjectId" },
        { field: "staff", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "date", type: "Date" },
      ],
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          date: new Date("2025/05/01"),
          season: deps.season[0]._id,
          staff: deps.staff[0]._id,
          team: deps.team[0]._id,
          registration_type: "register",
          changes: {
            role: "head",
            name: "test",
            en_name: "en_test",
          },
        },
        {
          date: new Date("2025/02/01"),
          season: deps.season[0]._id,
          staff: deps.staff[0]._id,
          team: deps.team[1]._id,
          registration_type: "register",
          changes: {
            role: "head",
            name: "test",
            en_name: "en_test",
          },
        },
      ],
      updatedData: {
        date: new Date("2025/08/02"),
      },
    },
  };
}
