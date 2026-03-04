import { UserModel, UserModelType } from "../models/user.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} from "../errors/index.js";

import { Request, Response, NextFunction } from "express";

const register = async (req: Request, res: Response) => {
  const { user_name, email, password } = req.body;
  if (!user_name || !email || !password) {
    new BadRequestError(
      "ユーザー名・メールアドレス・パスワードを入力してください。"
    );
  }

  const user = (await UserModel.create(
    req.body
  )) as unknown as InstanceType<UserModelType>;

  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSのみ
    maxAge: 30 * 24 * 60 * 60 * 1000, // リフレッシュトークンの有効期限（30日）
  });

  res.status(StatusCodes.CREATED).json({
    message: "新規登録しました。",
    accessToken: token,
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  console.log("login start");
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new BadRequestError("メールアドレス・パスワードを入力してください。")
    );
  }

  const user = (await UserModel.findOne({
    email,
  })) as InstanceType<UserModelType>;
  if (!user) {
    return next(new UnauthenticatedError("メールアドレスが間違っています。"));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new UnauthenticatedError("パスワードが間違っています。"));
  }

  console.log("login middle");

  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSのみ
    maxAge: 30 * 24 * 60 * 60 * 1000, // リフレッシュトークンの有効期限（30日）
  });

  res.status(StatusCodes.OK).json({
    message: "ログインしました。",
    accessToken: token,
    is_staff: user.is_staff,
    admin: user.admin,
  });
  console.log("login end");
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  delete req.user;
  res.status(StatusCodes.OK).json({
    message: "ログアウトしました。",
  });
};

const me = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError();
  }
  const user = (await UserModel.findById(
    req.user.userId
  )) as InstanceType<UserModelType>;
  if (!user) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({
    user_name: user.user_name,
    email: user.email,
    is_staff: user.is_staff,
  });
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthenticatedError();
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new UnauthenticatedError();
  }

  if (typeof decoded === "string" || !decoded.userId) {
    throw new UnauthenticatedError();
  }

  const user = (await UserModel.findById(
    decoded.userId
  )) as InstanceType<UserModelType>;
  if (!user) {
    throw new NotFoundError();
  }

  const accessToken = user.createJWT();

  res.status(StatusCodes.OK).json({
    message: "アクセストークンを再発行しました。",
    accessToken: accessToken,
  });
};

export { register, login, logout, me, refresh };
