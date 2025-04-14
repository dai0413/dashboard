const User = require("../models/user");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  console.log("register page");
  const user = await User.create(req.body);

  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSのみ
    maxAge: 30 * 24 * 60 * 60 * 1000, // リフレッシュトークンの有効期限（30日）
  });

  res.status(200).json({
    message: "新規登録しました。",
    accessToken: token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error((message = "this is error. shloud be refactaring."));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error((message = "this is error. shloud be refactaring."));
  }

  const token = user.createJWT();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSのみ
    maxAge: 30 * 24 * 60 * 60 * 1000, // リフレッシュトークンの有効期限（30日）
  });

  res.status(200).json({
    message: "ログインしました。",
    accessToken: token,
  });
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  delete req.user;
  res.status(200).json({
    message: "ログアウトしました。",
  });
};

const me = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    throw new Error((message = "this is error. shloud be refactaring."));
  }

  const user = await User.findById(userId);
  res.status(200).json({
    user_name: user.name,
    email: user.email,
    is_staff: user.is_staff,
  });
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new Error((message = "this is error. shloud be refactaring."));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error((message = "this is error. shloud be refactaring."));
    }

    const accessToken = user.createJWT();

    res.status(200).json({
      message: "アクセストークンを再発行しました。",
      accessToken: accessToken,
    });
  } catch (error) {
    throw new Error((message = "this is error. shloud be refactaring."));
  }
};

module.exports = { register, login, logout, me, refresh };
