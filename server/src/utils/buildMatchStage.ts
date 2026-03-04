import { Types } from "mongoose";
import { ParsedQs } from "qs";
import { BadRequestError } from "../errors/index.js";

type Operator = ">" | "<" | ">=" | "<=" | "!=" | "=";

const operatorMap: Record<Operator, string> = {
  ">": "$gt",
  "<": "$lt",
  ">=": "$gte",
  "<=": "$lte",
  "!=": "$ne",
  "=": "$eq",
};

const getTypedValue = (
  rawValue: string,
  type: string,
  timeZone: "JST" | null = "JST"
) => {
  const trimmed = rawValue.trim();
  switch (type) {
    case "ObjectId":
      return new Types.ObjectId(trimmed);
    case "Number":
      const n = Number(trimmed);
      if (isNaN(n))
        throw new BadRequestError(`${trimmed} は数値ではありません`);
      return n;
    case "Boolean":
      return trimmed === "true";
    case "Date":
      const dateStr =
        timeZone === "JST" ? trimmed + "T00:00:00+09:00" : trimmed;
      const d = new Date(dateStr);
      if (isNaN(d.getTime()))
        throw new BadRequestError(`${trimmed} は日付として無効です`);
      return d;
    default:
      return trimmed;
  }
};

// クエリ値から { op, value } を抽出
const parseValueWithOperator = (rawValue: string) => {
  let operator: Operator = "=";
  let value = rawValue;

  if (rawValue.startsWith("!")) {
    operator = "!=";
    value = rawValue.slice(1); // 先頭の ! を削除
  } else {
    const opMatch = rawValue.match(/^(>=|<=|>|<|!=|=)/);
    operator = (opMatch ? opMatch[1] : "=") as Operator;
    if (opMatch) value = rawValue.slice(opMatch[1].length);
  }

  return { operator, value };
};

// --- ヘルパー: query から matchStage を作る ---
export const buildMatchStage = (
  query: ParsedQs,
  queryConfig?: { field: string; type: string }[],
  buildCustomMatch?: (query: ParsedQs) => Record<string, any>
) => {
  if (!queryConfig) return {};

  const fieldConditions: Record<string, any> = {}; // AND用
  const orConditions: any[] = []; // OR用

  for (const { field, type } of queryConfig) {
    const raw = query[field];
    if (!raw) continue;

    // --- rawValues を string[] に変換 ---
    let rawValues: string[] = [];
    if (Array.isArray(raw)) {
      rawValues = raw
        .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
        .map((v) => v.trim());
    } else if (typeof raw === "object" && raw !== null) {
      rawValues = Object.values(raw)
        .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
        .map((v) => v.trim());
    } else if (typeof raw === "string") {
      rawValues = raw.split("|").map((v) => v.trim());
    } else {
      rawValues = [String(raw)];
    }

    // --- 特殊ケース: 複数単純値なら OR 条件 ---
    if (rawValues.length > 1 && rawValues.every((v) => !v.match(/^[<>!=]/))) {
      orConditions.push(
        ...rawValues.map((v) => ({
          [field]: getTypedValue(v, type),
        }))
      );
      continue;
    }

    // --- 条件を分類 ---
    const andObj: Record<string, any> = {};
    const orObjList: any[] = [];

    for (const rawValue of rawValues) {
      // --- 特殊指定: 存在チェック ---
      if (rawValue === "exists") {
        andObj[field] = { $exists: true, $ne: null };
        continue;
      }
      if (rawValue === "not_exists") {
        andObj[field] = { $exists: false };
        continue;
      }
      // --- 通常の演算子処理 ---
      const { operator, value } = parseValueWithOperator(rawValue);
      const mongoOp = operatorMap[operator] || "$eq";
      const typedValue = getTypedValue(value, type);

      // 演算子付きなら AND（範囲条件）、単純文字列 OR は orObjList
      if (["$gt", "$gte", "$lt", "$lte", "$ne"].includes(mongoOp)) {
        if (!andObj[field]) andObj[field] = {};
        andObj[field][mongoOp] = typedValue;
      } else if (mongoOp === "$eq" && rawValues.length > 1) {
        orObjList.push({ [field]: typedValue });
      } else {
        // 単一 $eq
        andObj[field] = typedValue;
      }
    }

    // マージ
    if (Object.keys(andObj).length) {
      fieldConditions[field] = andObj[field];
    }
    if (orObjList.length) {
      orConditions.push(...orObjList);
    }
  }

  // console.log(fieldConditions);

  // --- matchStage 組み立て ---
  let matchStage: Record<string, any> = {};
  const andConditions = Object.entries(fieldConditions).map(([k, v]) => ({
    [k]: v,
  }));

  if (andConditions.length && orConditions.length) {
    matchStage = { $and: [...andConditions, { $or: orConditions }] };
  } else if (orConditions.length) {
    matchStage = { $or: orConditions };
  } else if (andConditions.length > 1) {
    matchStage = { $and: andConditions };
  } else if (andConditions.length === 1) {
    matchStage = andConditions[0];
  }

  // --- カスタム条件 ---
  if (buildCustomMatch) {
    const customStage = buildCustomMatch(query);
    if (customStage && typeof customStage === "object") {
      matchStage = { ...matchStage, ...customStage };
    }
  }
  return matchStage;
};

// 配列や "|" は OR 条件

// 単一値や複数演算子付きの配列は AND 条件

// $and / $or のネストはサーバーに任せる
