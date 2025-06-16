const { BadRequestError } = require("../errors");

const checkFileExists = (req, res, next) => {
  if (!req.file) {
    throw new BadRequestError("ファイルが存在しません");
  }
  next();
};

module.exports = checkFileExists;
