import { Types } from "mongoose";
import { ParsedQs } from "qs";
import { BadRequestError } from "../errors/index.ts";
import { GetAllQuery } from "../modelsConfig/types/type.ts";

// --- ヘルパー: query から matchStage を作る ---
export const buildMatchStage = (
  query: ParsedQs,
  queryConfig?: GetAllQuery["query"],
  buildCustomMatch?: (query: ParsedQs) => Record<string, any>
) => {
  if (!queryConfig) return {};
  let matchStage: Record<string, any> = {};

  // --- 標準クエリ構築 ---
  for (const { field, type } of queryConfig ?? []) {
    const value = query[field];
    if (value == null || value === "") continue; // 空文字・未定義スキップ

    try {
      switch (type) {
        case "ObjectId":
          matchStage[field] = new Types.ObjectId(value as string);
          break;
        case "Number":
          const num = Number(value);
          if (isNaN(num))
            throw new BadRequestError(`${field} は数値である必要があります`);
          matchStage[field] = num;
          break;
        case "Boolean":
          matchStage[field] = value === "true";
          break;
        case "Date":
          const date = new Date(value as string);
          if (isNaN(date.getTime()))
            throw new BadRequestError(`${field} は有効な日付ではありません`);
          matchStage[field] = date;
          break;
        default:
          matchStage[field] = value;
      }
    } catch (err) {
      if (err instanceof BadRequestError) throw err;
      throw new BadRequestError(`${field} の型変換に失敗しました`);
    }
  }

  // --- カスタム条件マージ ---
  if (buildCustomMatch) {
    const customStage = buildCustomMatch(query);
    if (customStage && typeof customStage === "object") {
      matchStage = { ...matchStage, ...customStage };
    }
  }
  return matchStage;
};
