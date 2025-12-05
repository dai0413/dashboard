import z from "zod";
import {
  StaffMatchEventLogZodSchema,
  StaffMatchEventLogType,
  StaffMatchEventLogFormSchema,
  StaffMatchEventLogResponseSchema,
  StaffMatchEventLogPopulatedSchema,
} from "../schemas/staff-match-event-log.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function staffMatchEvengLog<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  StaffMatchEventLogType,
  z.infer<typeof StaffMatchEventLogFormSchema>,
  z.infer<typeof StaffMatchEventLogResponseSchema>,
  z.infer<typeof StaffMatchEventLogPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "staff-match-event-log",
    collection_name: "staffmatcheventlogs",
    SCHEMA: {
      DATA: StaffMatchEventLogZodSchema,
      FORM: StaffMatchEventLogFormSchema,
      RESPONSE: StaffMatchEventLogResponseSchema,
      POPULATED: StaffMatchEventLogPopulatedSchema,
    },
    TYPE: {} as StaffMatchEventLogType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "match", collection: "matchs" },
      { path: "team", collection: "teams" },
      { path: "staff", collection: "staffs" },
      { path: "matchEventType", collection: "matcheventtypes" },
    ],
    getAllConfig: {
      query: [
        { field: "match", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "staff", type: "ObjectId" },
        { field: "matchEventType", type: "ObjectId" },
      ],
      sort: { match: -1, time: -1, add_time: -1, order: -1, _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: true,
    TEST: {
      sampleData: (deps) => [
        {
          match: deps.match[0]._id,
          team: deps.team[0]._id,
          matchEventType: deps.matchEventType[0]._id,
          staff: deps.staff[0]._id,
          time: 10,
        },
      ],
      updatedData: {
        time: 5,
      },
    },
  };
}
