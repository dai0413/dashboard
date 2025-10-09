import { mongoose } from "mongoose";
import { Transfer } from "../models/transfer.js";
import { addPositionGroup } from "../order/position.js";
import { addPositionGroupOrder } from "../order/position_group.js";

export const getCurrentPlayersByTeamService = async (
  teamId,
  from_date_from,
  from_date_to
) => {
  const matchStage = {};

  // チームID
  if (teamId) {
    matchStage["latestTransfer.to_team"] = {
      $type: "objectId",
      $eq: new mongoose.Types.ObjectId(teamId),
    };
  }

  // from_date範囲
  if (from_date_from || from_date_to) {
    const dateFilter = {};
    if (from_date_from) dateFilter.$gte = new Date(from_date_from);
    if (from_date_to) dateFilter.$lte = new Date(from_date_to);
    matchStage["latestTransfer.from_date"] = dateFilter;
  }

  // form条件
  matchStage["latestTransfer.form"] = {
    $in: [
      "完全",
      "期限付き",
      "期限付き延長",
      "育成型期限付き",
      "育成型期限付き延長",
      "復帰",
      "更新",
    ],
  };

  return Transfer.aggregate([
    // 最新の移籍が上に来るように並べる
    { $sort: { doa: -1, _id: -1 } },

    // playerごとに最新の移籍だけを残す
    {
      $group: {
        _id: "$player",
        latestTransfer: { $first: "$$ROOT" },
      },
    },
    // optional: from_date でフィルタリング
    { $match: matchStage },
    // latestTransferをルートに置く
    {
      $replaceRoot: { newRoot: "$latestTransfer" },
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
    addPositionGroup,
    addPositionGroupOrder,
    { $sort: { position_group_order: 1, number: 1 } },
    { $project: { position_group: 0, position_group_order: 0 } },
  ]);
};
