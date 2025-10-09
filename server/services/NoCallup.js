import { mongoose } from "mongoose";
import { NationalMatchSeries } from "../models/national-match-series.js";

export const getNoCallUpService = async (countryId) => {
  return NationalMatchSeries.aggregate([
    {
      $match: { country: new mongoose.Types.ObjectId(countryId) },
    },
    {
      $lookup: {
        from: "nationalcallups",
        localField: "_id",
        foreignField: "series",
        as: "callups",
      },
    },
    {
      $addFields: {
        players_count: { $size: "$callups" },
      },
    },
    {
      $match: { players_count: 0 },
    },

    // country の情報を取得
    {
      $lookup: {
        from: "countries",
        localField: "country",
        foreignField: "_id",
        as: "country",
      },
    },
    { $unwind: { path: "$country", preserveNullAndEmptyArrays: true } },
    { $sort: { joined_at: -1, _id: -1 } },
  ]);
};
