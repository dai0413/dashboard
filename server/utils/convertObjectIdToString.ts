import { Types } from "mongoose";

function isObjectIdLike(value: any): value is Types.ObjectId {
  return (
    value instanceof Types.ObjectId ||
    (value &&
      typeof value === "object" &&
      typeof value.toString === "function" &&
      /^[a-f0-9]{24}$/i.test(value.toString()))
  );
}

export function convertObjectIdToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertObjectIdToString);
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (obj && typeof obj === "object") {
    if (isObjectIdLike(obj)) {
      return obj.toString();
    }

    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = convertObjectIdToString(value);
    }
    return newObj;
  }

  return obj;
}
