import { Request } from "express";
import mongoose from "mongoose";
import { NationalMatchSeriesModel } from "../models/national-match-series.js";
import { nationalCallup as formatNationalCallup } from "../utils/format/national-callup.js";
import { NationalCallUpResponseSchema, ResBody } from "@dai0413/myorg-shared";
import z from "zod";

type ResponseData = z.infer<typeof NationalCallUpResponseSchema>;

export const getNoCallUpService = async (
  req: Request
): Promise<ResBody<ResponseData[]>> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const countryId: string = req.params.countryId;

  const countResult = await NationalMatchSeriesModel.aggregate([
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
    { $count: "totalCount" },
  ]);

  const data = await NationalMatchSeriesModel.aggregate([
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
    { $skip: skip },
    { $limit: limit },
  ]);

  const formatData: ResponseData[] = data.map(formatNationalCallup);

  const responseData = {
    data: formatData,
    totalCount: countResult[0]?.totalCount || 0,
    page: page,
    pageSize: limit,
  };

  return responseData;
};
