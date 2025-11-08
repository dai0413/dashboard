import z from "zod";
import {
  UserZodSchema,
  UserType,
  UserFormSchema,
  UserResponseSchema,
  UserPopulatedSchema,
} from "../schemas/user.schema.js";
import { ControllerConfig } from "../types.js";
import { ParsedQs } from "qs";

export function user<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  UserType,
  z.infer<typeof UserFormSchema>,
  z.infer<typeof UserResponseSchema>,
  z.infer<typeof UserPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "user",
    SCHEMA: {
      DATA: UserZodSchema,
      FORM: UserFormSchema,
      RESPONSE: UserResponseSchema,
      POPULATED: UserPopulatedSchema,
    },
    TYPE: {} as UserType,
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
