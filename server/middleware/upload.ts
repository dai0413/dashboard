import multer, { FileFilterCallback } from "multer";
import { BadRequestError } from "../errors/index.ts";
import { Request } from "express";

// メモリ上で一時保存（ディスクに保存しない）
const storage = multer.memoryStorage();

// ファイルタイプ制限（例：CSVのみ許可）
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new BadRequestError("CSVファイルのみアップロード可能です"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
