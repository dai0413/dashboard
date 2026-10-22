import mongoose, { Types } from "mongoose";

function isObjectIdLike(value: unknown): value is Types.ObjectId {
  if (value instanceof Types.ObjectId) {
    return true;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    _bsontype?: string;
    toHexString?: () => string;
  };

  return (
    candidate._bsontype === "ObjectId" &&
    typeof candidate.toHexString === "function"
  );
}

export function convertObjectIdToString(value: any): any {
  if (value == null) {
    return value;
  }

  // ObjectId を文字列に変換
  if (isObjectIdLike(value)) {
    return value.toHexString();
  }

  // Date はそのまま保持
  if (value instanceof Date) {
    return value;
  }

  // 配列を再帰処理
  if (Array.isArray(value)) {
    return value.map(convertObjectIdToString);
  }

  // Mongoose Document をプレーンオブジェクトに変換
  if (
    value instanceof mongoose.Document ||
    (value.$__ && typeof value.toObject === "function")
  ) {
    return convertObjectIdToString(value.toObject());
  }

  // 通常のオブジェクトを再帰処理
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        convertObjectIdToString(child),
      ]),
    );
  }

  return value;
}
