import mongoose from "mongoose";
import { TransferModel } from "../models/transfer.ts";
import { SeasonModel } from "../models/season.ts";
import { TeamCompetitionSeasonModel } from "../models/team-competition-season.ts";

export const getNoNumberService = async (
  competitionIds: string[] = [],
  startDate: string | null = null,
  endDate: string | null = null
) => {
  // seson検索
  const seasonQuery: Record<string, any> = {
    competition: {
      $in: competitionIds.map((id) => new mongoose.Types.ObjectId(id)),
    },
  };

  if (startDate && endDate) {
    seasonQuery.start_date = { $lte: new Date(endDate) };
    seasonQuery.end_date = { $gte: new Date(startDate) };
  } else if (startDate) {
    seasonQuery.end_date = { $gte: new Date(startDate) };
  } else if (endDate) {
    seasonQuery.start_date = { $lte: new Date(endDate) };
  }

  const competitionObjectIds = competitionIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  const dateMatch: any = {};
  if (startDate) dateMatch.end_date = { $gte: new Date(startDate) };
  if (endDate) dateMatch.start_date = { $lte: new Date(endDate) };

  const pipeline = [
    // --- Season のフィルタリング ---
    {
      $match: {
        competition: { $in: competitionObjectIds },
        ...dateMatch,
      },
    },
    // --- TeamCompetitionSeason との紐付け ---
    {
      $lookup: {
        from: "teamcompetitionseasons",
        localField: "_id",
        foreignField: "season",
        as: "teamSeasons",
      },
    },
    { $unwind: "$teamSeasons" },
    // --- 必要なフィールドを抽出 ---
    {
      $project: {
        _id: 0,
        seasonId: "$_id",
        start_date: 1,
        end_date: 1,
        team: "$teamSeasons.team",
      },
    },
  ];

  const seasonTeamPairs = await SeasonModel.aggregate(pipeline);

  const matchStage: Record<string, any> = {
    $and: [
      {
        $or: seasonTeamPairs.map((pair) => ({
          "to_team._id": new mongoose.Types.ObjectId(pair.team),
          from_date: {
            $gte: pair.start_date,
            $lte: pair.end_date,
          },
        })),
      },
      { $or: [{ number: { $exists: false } }, { number: null }] },
      {
        form: {
          $in: [
            "完全",
            "期限付き",
            "期限付き延長",
            "育成型期限付き",
            "育成型期限付き延長",
            "復帰",
            "更新",
          ],
        },
      },
    ],
  };

  // 日付範囲が指定されていれば追加
  matchStage.from_date = {};

  if (startDate) {
    matchStage.from_date.$gte = new Date(startDate);
  }

  if (endDate) {
    matchStage.from_date.$lte = new Date(endDate);
  }

  // from_date が空なら削除
  if (Object.keys(matchStage.from_date).length === 0) {
    delete matchStage.from_date;
  }

  const noNumberData = TransferModel.aggregate([
    // 最新の移籍が上に来るように並べる
    { $sort: { from_date: -1, _id: -1 } },

    // to_team の情報を取得
    {
      $lookup: {
        from: "teams",
        localField: "to_team",
        foreignField: "_id",
        as: "to_team",
      },
    },
    { $unwind: { path: "$to_team", preserveNullAndEmptyArrays: true } },

    // coutnryIdのフィルタリング
    ...[
      {
        $match: matchStage,
      },
    ],

    // from_team の情報を取得
    {
      $lookup: {
        from: "teams",
        localField: "from_team",
        foreignField: "_id",
        as: "from_team",
      },
    },
    { $unwind: { path: "$from_team", preserveNullAndEmptyArrays: true } },

    // player の情報を取得
    {
      $lookup: {
        from: "players",
        localField: "player",
        foreignField: "_id",
        as: "player",
      },
    },
    { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },

    { $sort: { from_date: -1, _id: -1 } },
  ]);

  console.log("noNumberData", noNumberData);

  return noNumberData;
};

// const seasons = await SeasonModel.find({
//   competition: competitionIds.map((id) => new mongoose.Types.ObjectId(id)),
//   start_date: { $lte: new Date(endDate) },
//   end_date: { $gte: new Date(startDate) },
// }).select("_id start_date end_date");
// const seasonIds = seasons.map((s) => s._id);
// const teamSeasons = await TeamCompetitionSeasonModel.find({
//   season: { $in: seasonIds },
// }).select("team season");

// const seasonTeamPairs = teamSeasons.map((ts) => {
//   const season = seasons.find((s) => s._id.equals(ts.season));
//   return { season, team: ts.team.toString() };
// });
