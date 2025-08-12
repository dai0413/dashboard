const mongoose = require("mongoose");
const Transfer = require("../models/transfer");

const getNoNumberService = async (
  countryId,
  startDate = null,
  endDate = null
) => {
  const matchStage = {
    "to_team.country": new mongoose.Types.ObjectId(countryId),
    $or: [{ number: { $exists: false } }, { number: null }],
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

  return Transfer.aggregate([
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
};

module.exports = getNoNumberService;
