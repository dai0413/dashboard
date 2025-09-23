const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const mongoose = require("mongoose");
const { getNest } = require("../../utils/getNest");
const {
  competition: { MODEL, POPULATE_PATHS },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  if (req.query.country) {
    try {
      matchStage.country = new mongoose.Types.ObjectId(req.query.country);
    } catch {
      return res.status(400).json({ error: "Invalid country ID" });
    }
  }

  const dat = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { _id: 1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const createData = {
    ...req.body,
  };

  const data = await MODEL.create(createData);
  const populatedData = await MODEL.findById(data._id).populate(
    getNestField(true)
  );
  res
    .status(StatusCodes.CREATED)
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

  res.status(StatusCodes.OK).json({
    data: {
      ...data.toObject(),
    },
  });
};

const updateItem = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await MODEL.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

  // update
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
