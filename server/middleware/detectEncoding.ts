import iconv from "iconv-lite";
import jschardet from "jschardet";
import { Readable } from "stream";
import { BadRequestError } from "../errors/index.js";
import { NextFunction, Response } from "express";
import { DecodedRequest } from "../types.js";

export default function detectEncoding(
  req: DecodedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.file || !req.file.buffer) {
    throw new BadRequestError("ファイルが存在しません");
  }

  const buffer = req.file.buffer;

  // 自動判定
  const detected = jschardet.detect(buffer);
  const encoding = detected.encoding?.toLowerCase();

  let decodedText;
  if (encoding?.startsWith("utf")) {
    decodedText = buffer.toString("utf-8");
  } else if (encoding?.includes("shift_jis") || encoding?.includes("sjis")) {
    decodedText = iconv.decode(buffer, "Shift_JIS");
  } else {
    throw new BadRequestError(
      `未対応のエンコーディング: ${encoding || "不明"}`
    );
  }

  // デコード済みのStreamをセット
  req.decodedStream = Readable.from(decodedText);
  next();
}
