import z from "zod";
import {
  StaffRegistrationZodSchema,
  StaffRegistrationType,
  StaffRegistrationFormSchema,
  StaffRegistrationResponseSchema,
  StaffRegistrationPopulatedSchema,
} from "../schemas/staff-registration.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function staffRegistration<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  TDoc,
  StaffRegistrationType,
  z.infer<typeof StaffRegistrationFormSchema>,
  z.infer<typeof StaffRegistrationResponseSchema>,
  z.infer<typeof StaffRegistrationPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "staff-registration",
    collection_name: "staffregistrations",
    SCHEMA: {
      DATA: StaffRegistrationZodSchema,
      FORM: StaffRegistrationFormSchema,
      RESPONSE: StaffRegistrationResponseSchema,
      POPULATED: StaffRegistrationPopulatedSchema,
    },
    TYPE: {} as StaffRegistrationType,
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
        { field: "registration_status", type: "String" },
        { field: "registration_type", type: "String" },
      ],
      sort: { _id: 1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          date: new Date("2025/08/01"),
          season: deps.season[0]._id,
          staff: deps.staff[0]._id,
          team: deps.team[0]._id,
          name: "test",
          en_name: "en_test",
          registration_type: "register",
          role: "test",
          registration_status: "active",
        },
        {
          date: new Date("2025/02/01"),
          season: deps.season[0]._id,
          staff: deps.staff[0]._id,
          team: deps.team[1]._id,
          name: "test",
          en_name: "en_test",
          registration_type: "register",
          role: "test",
          registration_status: "active",
        },
      ],
      updatedData: {
        role: "gk-corch",
      },
    },
  };
}
