import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

export default class UnauthenticatedError extends CustomAPIError {
  constructor(message: string = "ログインしてください。") {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
