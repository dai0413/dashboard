const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.message = message || "リクエストの内容が不十分です。";
  }
}

module.exports = BadRequestError;
