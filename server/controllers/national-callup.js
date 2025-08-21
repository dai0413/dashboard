const NationalCallUp = require("../models/national-callup");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const mongoose = require("mongoose");
const { formatNationalCallup } = require("../utils/format-national-callup");
const addPositionGroupOrder = require("../order/position_group");

const getAllNationalCallUp = async (req, res) => {
  const series = req.query.series
    ? new mongoose.Types.ObjectId(req.query.series)
    : null;
  const country = req.query.country
    ? new mongoose.Types.ObjectId(req.query.country)
    : null;

  const matchStage = {};

  if (req.query.player)
    matchStage.player = new mongoose.Types.ObjectId(req.query.player);

  const nationalMatchSeries = await NationalCallUp.aggregate([
    addPositionGroupOrder,
    ...(series ? [{ $match: { series } }] : []),
    {
      $lookup: {
        from: "nationalmatchseries",
        localField: "series",
        foreignField: "_id",
        as: "series",
      },
    },
    { $unwind: "$series" },
    ...(country ? [{ $match: { "series.country": country } }] : []),
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
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
    {
      $sort: {
        series: -1,
        position_group_order: 1,
        number: 1,
        _id: -1,
      },
    },
    { $project: { position_group_order: 0 } },
  ]);

  const result = nationalMatchSeries.map(formatNationalCallup);
  res.status(StatusCodes.OK).json({ data: result });
};

const createNationalCallUp = async (req, res) => {
  let formatted;

  if (Array.isArray(req.body)) {
    const createdData = await NationalCallUp.insertMany(req.body);
    const populatedData = await NationalCallUp.find({
      _id: { $in: createdData.map((d) => d._id) },
    })
      .populate("series")
      .populate("player")
      .populate("team");
    formatted = populatedData.map(formatNationalCallup);
  } else {
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
    formatted = formatNationalCallup(pupulatedData);
  }
  res.status(StatusCodes.CREATED).json({
    message: "追加しました",
    data: formatted,
  });
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
    data: formatNationalCallup(nationalMatchSeries),
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
  res
    .status(StatusCodes.OK)
    .json({ message: "編集しました", data: formatNationalCallup(populated) });
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
