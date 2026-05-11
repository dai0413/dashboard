import {
  UserZodSchema,
  UserFormSchema,
  UserResponseSchema,
  UserPopulatedSchema,
} from "../schemas/user.schema.js";
import { ControllerConfig } from "../types/models-config.js";
import { ParsedQs } from "qs";

export function user<TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>,
): ControllerConfig<
  typeof UserZodSchema,
  typeof UserFormSchema,
  typeof UserResponseSchema,
  typeof UserPopulatedSchema
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "user",
    collection_name: "users",
    SCHEMA: {
      DATA: UserZodSchema,
      FORM: UserFormSchema,
      RESPONSE: UserResponseSchema,
      POPULATED: UserPopulatedSchema,
    },
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [],
    getAllConfig: {
      buildCustomMatch: customMatchFn,
    },
    bulk: false,
    download: false,
    TEST: {
      sampleData: [
        {
          user_name: "name",
          email: "email@mail.com",
          password: "mypassword",
          admin: true,
          is_staff: true,
        },
      ],
      updatedData: { user_name: "updated_name" },
    },
  };
}
