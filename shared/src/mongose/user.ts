import mongoose, { Types, Schema, Document, Model } from "mongoose";
import { UserType } from "../schemas/user.schema.ts";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface IUser extends Omit<UserType, "_id">, Document {
  _id: Types.ObjectId;
}

interface IUserMethods {
  createJWT(): string;
  createRefreshToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModelType extends Model<IUser, {}, IUserMethods> {}

const UserSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    user_name: {
      type: String,
      minlength: [3, "ユーザー名は3文字以上で入力してください。"],
      required: [true, "ユーザー名は必須です。"],
    },
    email: {
      type: String,
      required: [true, "メールアドレスは必須です。"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "有効なメールアドレス(@を含め)を入力してください。",
      ],
    },
    password: {
      type: String,
      minlength: [8, "パスワードは8文字以上で入力してください。"],
      required: [true, "パスワードは必須です。"],
    },
    admin: {
      type: Boolean,
      default: false,
    },
    is_staff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.createJWT = function () {
  const secret: Secret = process.env.JWT_SECRET!;
  const expiresIn: SignOptions["expiresIn"] =
    (process.env.JWT_EXPIRATION as any) || "15m";

  return jwt.sign(
    {
      userId: this._id,
      name: this.user_name,
      email: this.email,
      is_staff: this.is_staff,
      admin: this.admin,
    },
    secret,
    { expiresIn }
  );
};

UserSchema.methods.createRefreshToken = function () {
  const secret: Secret = process.env.JWT_SECRET!;
  const expiresIn: SignOptions["expiresIn"] =
    (process.env.JWT_REFRESH_EXPIRATION as any) || "7d";

  return jwt.sign(
    {
      userId: this._id,
      name: this.user_name,
      email: this.email,
      is_staff: this.is_staff,
      admin: this.admin,
    },
    secret,
    { expiresIn }
  );
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  UserSchema
);
