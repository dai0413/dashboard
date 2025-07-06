const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const register = async (req, res) => {
  const { user_name, email, password } = req.body;
  if (!user_name || !email || !password) {
    new BadRequestError(
      "ユーザー名・メールアドレス・パスワードを入力してください。"
    );
  }

  const user = await User.create(req.body);

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

const login = async (req, res, next) => {
  console.log("login start");
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new BadRequestError("メールアドレス・パスワードを入力してください。")
    );
  }

  const user = await User.findOne({ email });
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

const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  delete req.user;
  res.status(StatusCodes.OK).json({
    message: "ログアウトしました。",
  });
};

const me = async (req, res) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError();
  }
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({
    user_name: user.name,
    email: user.email,
    is_staff: user.is_staff,
  });
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthenticatedError();
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    throw new UnauthenticatedError();
  }

  if (!decoded || !decoded.userId) {
    throw new UnauthenticatedError();
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new NotFoundError();
  }

  const accessToken = user.createJWT();

  res.status(StatusCodes.OK).json({
    message: "アクセストークンを再発行しました。",
    accessToken: accessToken,
  });
};

module.exports = { register, login, logout, me, refresh };
