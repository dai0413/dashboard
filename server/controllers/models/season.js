const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const mongoose = require("mongoose");

const { getNest } = require("../../utils/getNest");
const {
  season: { MODEL, POPULATE_PATHS, bulk },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  if (req.query.competition) {
    try {
      matchStage.competition = new mongoose.Types.ObjectId(
        req.query.competition
      );
    } catch {
      return res.status(400).json({ error: "Invalid competition ID" });
    }
  }

  if (req.query.current !== undefined) {
    matchStage.current = req.query.current === "true";
  }

  const dat = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { start_date: -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
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
    params: { id },
  } = req;
  const data = await MODEL.findById(id).populate(getNestField(true));
  if (!data) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({ data });
};

const updateItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const updated = await MODEL.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

  const populated = await MODEL.findById(updated._id).populate(
    getNestField(true)
  );
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const team = await MODEL.findOneAndDelete({ _id: id });
  if (!team) {
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
