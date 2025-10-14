import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/index.ts";

export default function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("in the error handle middleware");

  // デフォルト値
  let customError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: "Something went wrong, try again later",
  };

  if (err instanceof CustomAPIError) {
    customError.statusCode =
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    customError.msg = err.message;
  } else if (err instanceof Error && (err as any).name === "ValidationError") {
    // POST "/register"  のとき 必須項目がないときのエラー
    const e = err as any;
    customError.msg = Object.values(e.errors)
      .map((item: any) => item.message)
      .join("");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err && typeof err === "object" && (err as any).code === 11000) {
    // データベースでのエラーであるerr.code === 11000が発見されたとき
    // 重複エラー
    const e = err as any;
    const field = Object.keys(e.keyValue).join(", ");
    customError.msg = `入力された${field}はすでに登録されています。`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err instanceof Error && (err as any).name === "CastError") {
    // /:id に無効なidが入力されたとき
    const e = err as any;
    customError.msg = `No item found with id: ${e.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  } else if (err instanceof Error) {
    customError.msg = err.message;
  }

  return res.status(customError.statusCode).json({
    error: { message: customError.msg, code: customError.statusCode },
  });
}
