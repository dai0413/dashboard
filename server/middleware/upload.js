import multer from "multer";
import { BadRequestError } from "../errors/index.js";

// メモリ上で一時保存（ディスクに保存しない）
const storage = multer.memoryStorage();

// ファイルタイプ制限（例：CSVのみ許可）
const fileFilter = (req, file, cb) => {
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
