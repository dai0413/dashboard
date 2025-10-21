import z from "zod";
import { UserModel, IUser } from "../../server/models/user.ts";
import {
  UserZodSchema,
  UserType,
  UserFormSchema,
  UserResponseSchema,
  UserPopulatedSchema,
} from "../schemas/user.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const user: ControllerConfig<
  IUser,
  UserType,
  z.infer<typeof UserFormSchema>,
  z.infer<typeof UserResponseSchema>,
  z.infer<typeof UserPopulatedSchema>
> = {
  name: "user",
  SCHEMA: {
    DATA: UserZodSchema,
    FORM: UserFormSchema,
    RESPONSE: UserResponseSchema,
    POPULATED: UserPopulatedSchema,
  },
  TYPE: {} as UserType,
  MONGO_MODEL: UserModel,
  POPULATE_PATHS: [],
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
