import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/index.js";
import { NextFunction, Request, Response } from "express";

const isDevelopment = process.env.NODE_ENV !== "production";

interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  is_staff: boolean;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export default function authmiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (isDevelopment) return next();

  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new UnauthenticatedError();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

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
