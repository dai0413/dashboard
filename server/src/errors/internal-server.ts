import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

export default class InternalServerError extends CustomAPIError {
  constructor(message: string = "サーバーエラーです。") {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
