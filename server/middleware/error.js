import { StatusCodes } from "http-status-codes";

export default function errorHandlerMiddleware(err, req, res, next) {
  console.log("in the error handle middleware");
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };
  console.log("error is ", customError);

  // POST "/register"  のとき 必須項目がないときのエラー
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join("");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // データベースでのエラーであるerr.code === 11000が発見されたとき
  // 重複エラー
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    customError.msg = `入力された${field}はすでに登録されています。`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // /:id に無効なidが入力されたとき
  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({
    error: { message: customError.msg, code: customError.statusCode },
  });
}
