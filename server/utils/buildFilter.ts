const OPERATOR_MAP: Record<string, string> = {
  equals: "$eq",
  "not-equal": "$ne",
  contains: "$regex",
  gte: "$gte",
  lte: "$lte",
  greater: "$gt",
  less: "$lt",
  "is-empty": "$exists",
  "is-not-empty": "$exists",
};

import { FilterableFieldDefinition } from "../../shared/types.ts";

export const buildMongoFilter = (filters: FilterableFieldDefinition[] = []) => {
  if (filters.length === 0) return {};

  const andConditions: any[] = [];
  const orConditions: any[] = [];

  for (const f of filters) {
    const op = OPERATOR_MAP[f.operator || "equals"];
    if (!op) continue;

    let condition: Record<string, any>;

    // ✅ 1. valueのない empty 系は先に処理して return する
    if (f.operator === "is-empty") {
      condition = { [f.key]: { $exists: false } };
    } else if (f.operator === "is-not-empty") {
      condition = { [f.key]: { $exists: true } };
    } else {
      // ✅ 2. それ以外は value を利用
      let value = f.value;
      if (value === undefined || value === null) continue;

      // 3. 型に応じて変換
      switch (f.type) {
        case "Date":
          value = new Date(value as string);
          break;
        case "number":
          if (typeof value === "string") value = Number(value);
          break;
        case "string":
        case "select":
        case "checkbox":
        case "datetime-local":
        default:
          break;
      }

      if (f.operator === "contains") {
        if (typeof value === "string") {
          condition = { [f.key]: { [op]: String(f.value), $options: "i" } };
        } else {
          condition = { [f.key]: { [op]: value } };
        }
      } else if (f.operator === "in" && Array.isArray(value)) {
        condition = { [f.key]: { [op]: value } };
      } else {
        condition = { [f.key]: { [op]: value } };
      }
    }

    if (f.logic === "OR") {
      orConditions.push(condition);
    } else {
      andConditions.push(condition);
    }
  }

  if (orConditions.length > 0 && andConditions.length > 0) {
    return { $and: [...andConditions, { $or: orConditions }] };
  } else if (orConditions.length > 0) {
    return { $or: orConditions };
  } else {
    return andConditions.length > 1
      ? { $and: andConditions }
      : andConditions[0];
  }
};
