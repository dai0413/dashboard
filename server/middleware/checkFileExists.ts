import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/index.js";

export default function checkFileExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.file) {
    throw new BadRequestError("ファイルが存在しません");
  }
  next();
}
