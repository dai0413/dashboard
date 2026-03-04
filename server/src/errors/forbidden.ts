import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

export default class ForbiddenError extends CustomAPIError {
  constructor(message: string = "アクセス権限がありません。") {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
