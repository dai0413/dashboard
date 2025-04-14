const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new UnauthenticatedError();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      is_staff: decoded.is_staff,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError();
  }
};

module.exports = auth;
