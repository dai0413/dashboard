import { PopulatePath } from "@dai0413/shared";
import { PipelineStage } from "mongoose";

// populate 用
const getPopulateOptions = (POPULATE_PATHS: PopulatePath[]) =>
  POPULATE_PATHS.map(({ path }) => ({ path }));

// aggregate 用
const getAggregateLookups = (POPULATE_PATHS: PopulatePath[]): PipelineStage[] =>
  POPULATE_PATHS.flatMap(({ path, collection }) => [
    {
      $lookup: {
        from: collection!,
        localField: path,
        foreignField: "_id",
        as: path,
      },
    },
    { $unwind: { path: `$${path}`, preserveNullAndEmptyArrays: true } },
  ]);

// 関数オーバーロードで返す型を明確にする
export function getNest(
  populate: true,
  POPULATE_PATHS: PopulatePath[]
): { path: string }[];
export function getNest(
  populate: false,
  POPULATE_PATHS: PopulatePath[]
): PipelineStage[];
export function getNest(populate: boolean, POPULATE_PATHS: PopulatePath[]) {
  return populate
    ? getPopulateOptions(POPULATE_PATHS)
    : getAggregateLookups(POPULATE_PATHS);
}
