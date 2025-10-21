import { Types } from "mongoose";

export function convertObjectIdToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertObjectIdToString);
  } else if (obj && typeof obj === "object" && !(obj instanceof Date)) {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Types.ObjectId) {
        newObj[key] = value.toString();
      } else {
        newObj[key] = convertObjectIdToString(value);
      }
    }
    return newObj;
  }
  return obj;
}
