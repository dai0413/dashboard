import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";

export const UserZodSchema = z.object({
  _id: objectId,
  user_name: z
    .string()
    .min(3, "ユーザー名は3文字以上で入力してください。")
    .refine((v) => !!v, { message: "user_nameは必須です" }),
  email: z.string().refine((v) => !!v, { message: "emailは必須です" }),
  password: z.string().refine((v) => !!v, { message: "passwordは必須です" }),
  admin: z.boolean().default(false),
  is_staff: z.boolean().default(false),

  createdAt: dateField,
  updatedAt: dateField,
});

export type UserType = z.infer<typeof UserZodSchema>;

export const UserFormSchema = UserZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserResponseSchema = UserZodSchema;

export const UserPopulatedSchema = UserZodSchema;
