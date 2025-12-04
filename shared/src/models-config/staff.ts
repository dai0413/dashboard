import z from "zod";
import {
  StaffZodSchema,
  StaffType,
  StaffFormSchema,
  StaffResponseSchema,
  StaffPopulatedSchema,
} from "../schemas/staff.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function staff<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  StaffType,
  z.infer<typeof StaffFormSchema>,
  z.infer<typeof StaffResponseSchema>,
  z.infer<typeof StaffPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "staff",
    SCHEMA: {
      DATA: StaffZodSchema,
      FORM: StaffFormSchema,
      RESPONSE: StaffResponseSchema,
      POPULATED: StaffPopulatedSchema,
    },
    TYPE: {} as StaffType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [{ path: "player", collection: "players" }],
    getAllConfig: {
      query: [{ field: "player", type: "ObjectId" }],
      sort: { _id: -1 },
      buildCustomMatch: customMatchFn,
    },
    bulk: true,
    download: true,
    TEST: {
      sampleData: [
        {
          name: "test_staff_name",
          en_name: "test_staff_en_name",
        },
      ],
      updatedData: {
        name: "updated_name",
      },
    },
  };
}
