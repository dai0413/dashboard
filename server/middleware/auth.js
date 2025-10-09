import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";

const isDevelopment = process.env.NODE_ENV !== "production";

export default function authmiddleware(req, res, next) {
  if (isDevelopment) return next();

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
}
