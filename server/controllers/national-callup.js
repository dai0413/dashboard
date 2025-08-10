const NationalCallUp = require("../models/national-callup");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const mongoose = require("mongoose");

const getAllNationalCallUp = async (req, res) => {
  const country = req.query.country || null;

  const matchStage = {};
  if (country) {
    matchStage["series.country"] = country;
  }

  const nationalMatchSeries = await NationalCallUp.aggregate([
    {
      $lookup: {
        from: "nationalmatchseries",
        localField: "series",
        foreignField: "_id",
        as: "series",
      },
    },
    { $unwind: "$series" },
    ...(country
      ? [
          {
            $match: {
              "series.country": new mongoose.Types.ObjectId(country),
            },
          },
        ]
      : []),
    {
      $lookup: {
        from: "players",
        localField: "player",
        foreignField: "_id",
        as: "player",
      },
    },
    { $unwind: "$player" },
    {
      $lookup: {
        from: "teams",
        localField: "team",
        foreignField: "_id",
        as: "team",
      },
    },
    { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
    { $sort: { joined_at: -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: nationalMatchSeries });
};

const createNationalCallUp = async (req, res) => {
  const nationalMatchSeriesData = {
    ...req.body,
  };

  const nationalMatchSeries = await NationalCallUp.create(
    nationalMatchSeriesData
  );

  const pupulatedData = await NationalCallUp.findById(nationalMatchSeries._id)
    .populate("series")
    .populate("player")
    .populate("team");

  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: pupulatedData });
};

const getNationalCallUp = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: nationalMatchSeriesId },
  } = req;
  const nationalMatchSeries = await NationalCallUp.findById(
    nationalMatchSeriesId
  )
    .populate("series")
    .populate("player")
    .populate("team");
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...nationalMatchSeries.toObject(),
    },
  });
};

const updateNationalCallUp = async (req, res) => {
  const {
    params: { id: nationalMatchSeriesId },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await NationalCallUp.findByIdAndUpdate(
    { _id: nationalMatchSeriesId },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updated) {
    throw new NotFoundError();
  }

  // update
  const populated = await NationalCallUp.findById(updated._id)
    .populate("series")
    .populate("player")
    .populate("team");
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteNationalCallUp = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: nationalMatchSeriesId },
  } = req;

  const nationalMatchSeries = await NationalCallUp.findOneAndDelete({
    _id: nationalMatchSeriesId,
  });
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

module.exports = {
  getAllNationalCallUp,
  createNationalCallUp,
  getNationalCallUp,
  updateNationalCallUp,
  deleteNationalCallUp,
};
