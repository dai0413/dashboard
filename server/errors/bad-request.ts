import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

export default class BadRequestError extends CustomAPIError {
  constructor(message: string = "リクエストの内容が不十分です。") {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
