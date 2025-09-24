const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const mongoose = require("mongoose");
const { formatNationalCallup } = require("../../utils/format");
const addPositionGroupOrder = require("../../order/position_group");
const { getNest } = require("../../utils/getNest");
const {
  nationalCallup: { MODEL, POPULATE_PATHS },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const series = req.query.series
    ? new mongoose.Types.ObjectId(req.query.series)
    : null;
  const country = req.query.country
    ? new mongoose.Types.ObjectId(req.query.country)
    : null;

  const matchStage = {};

  if (req.query.player)
    matchStage.player = new mongoose.Types.ObjectId(req.query.player);

  const nationalMatchSeries = await MODEL.aggregate([
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
    { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },
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

const createItem = async (req, res) => {
  let populatedData;
  if (bulk && Array.isArray(req.body)) {
    const docs = await MODEL.insertMany(req.body);

    const ids = docs.map((doc) => doc._id);
    populatedData = await MODEL.find({ _id: { $in: ids } }).populate(
      getNestField(true)
    );
  } else {
    const data = await MODEL.create(req.body);
    populatedData = await MODEL.findById(data._id).populate(getNestField(true));
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "追加しました", data: populatedData });
};

const getItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: nationalMatchSeriesId },
  } = req;
  const nationalMatchSeries = await MODEL.findById(
    nationalMatchSeriesId
  ).populate(getNestField(true));
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: formatNationalCallup(nationalMatchSeries),
  });
};

const updateItem = async (req, res) => {
  const {
    params: { id: nationalMatchSeriesId },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await MODEL.findByIdAndUpdate(
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
  const populated = await MODEL.findById(updated._id).populate(
    getNestField(true)
  );
  res
    .status(StatusCodes.OK)
    .json({ message: "編集しました", data: formatNationalCallup(populated) });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: nationalMatchSeriesId },
  } = req;

  const nationalMatchSeries = await MODEL.findOneAndDelete({
    _id: nationalMatchSeriesId,
  });
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

module.exports = {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
};
