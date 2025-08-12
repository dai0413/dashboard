const mongoose = require("mongoose");
const Transfer = require("../models/transfer");

const getCurrentLoanPlayersByTeamService = async (teamId) => {
  return Transfer.aggregate([
    // 最新の移籍が上に来るように並べる
    { $sort: { from_date: -1, _id: -1 } },

    // playerごとに最新の移籍だけを残す
    {
      $group: {
        _id: "$player",
        latestTransfer: { $first: "$$ROOT" },
      },
    },

    // latestTransferをルートに置く
    {
      $replaceRoot: { newRoot: "$latestTransfer" },
    },

    // 最新移籍の from_team が一致するプレイヤーだけ残す
    {
      $match: {
        from_team: new mongoose.Types.ObjectId(teamId),
        form: {
          $in: [
            "期限付き",
            "期限付き延長",
            "育成型期限付き",
            "育成型期限付き延長",
          ],
        },
      },
    },

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

module.exports = getCurrentLoanPlayersByTeamService;
