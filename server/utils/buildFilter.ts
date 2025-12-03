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

import { FilterableFieldDefinition } from "@dai0413/myorg-shared";
import { Types } from "mongoose";

export const buildMongoFilter = (filters: FilterableFieldDefinition[] = []) => {
  if (filters.length === 0) return {};

  const andConditions: any[] = [];
  const orConditions: any[] = [];

  for (const f of filters) {
    const op = OPERATOR_MAP[f.operator || "equals"];
    if (!op) continue;

    let condition: Record<string, any>;

    if (f.operator === "is-empty") {
      condition = { [f.key]: { $exists: false } };
    } else if (f.operator === "is-not-empty") {
      condition = { [f.key]: { $exists: true } };
    } else {
      let value: any = f.value;
      if (!value || (Array.isArray(value) && value.length === 0)) continue;

      // 型変換処理
      const convertValue = (v: any) => {
        switch (f.type) {
          case "Date":
            return new Date(v);
          case "number":
            return typeof v === "string" ? Number(v) : v;
          case "string":
          case "select":
            if (typeof v === "string" && /^[0-9a-fA-F]{24}$/.test(v)) {
              return new Types.ObjectId(v);
            }
            return v;
          default:
            return v;
        }
      };

      if (Array.isArray(value)) {
        // --- 日付の equals は「日付一致」判定(時刻除く)に変換 ---
        if (f.operator === "equals" && f.type === "Date") {
          if (!f.value) continue;
          const raw = f.value[0];
          const dt = new Date(raw as string); // 送られたのは "UTC"

          // --- JST の日付を取りたい ---
          const jst = new Date(dt.getTime() + 9 * 60 * 60 * 1000); // UTC→JST

          const year = jst.getFullYear();
          const month = jst.getMonth();
          const date = jst.getDate();

          // JST の 00:00 を UTC に戻す
          const start = new Date(Date.UTC(year, month, date, 0, 0, 0));
          const end = new Date(Date.UTC(year, month, date + 1, 0, 0, 0));

          const condition = { [f.key]: { $gte: start, $lt: end } };

          if (f.logic === "OR") orConditions.push(condition);
          else andConditions.push(condition);

          continue;
        }

        // equals（Date 以外）
        if (f.operator === "equals") {
          value = value.map(convertValue);
          condition = { [f.key]: { $in: value } };
        } else {
          // $gt / $lt / $gte / $lte など
          value = convertValue(value[0]);
          condition = { [f.key]: { [op]: value } };
        }
      } else {
        value = convertValue(value);
        condition = { [f.key]: { [op]: value } };
      }

      // operator ごとの処理
      if (f.operator === "contains") {
        const regexValue = Array.isArray(value) ? value[0] : value;
        condition =
          typeof regexValue === "string"
            ? { [f.key]: { [op]: regexValue, $options: "i" } }
            : { [f.key]: { [op]: regexValue } };
      } else if (f.operator === "equals" && Array.isArray(value)) {
        condition = { [f.key]: { $in: value } };
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

  if (orConditions.length > 0 && andConditions.length > 0)
    return { $and: [...andConditions, { $or: orConditions }] };
  if (orConditions.length > 0) return { $or: orConditions };
  return andConditions.length > 1 ? { $and: andConditions } : andConditions[0];
};
