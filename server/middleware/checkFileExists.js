import { BadRequestError } from "../errors/index.js";

export default function checkFileExists(req, res, next) {
  if (!req.file) {
    throw new BadRequestError("ファイルが存在しません");
  }
  next();
}
