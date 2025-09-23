const Season = require("../models/season");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const mongoose = require("mongoose");

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

  const dat = await Season.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $lookup: {
        from: "competitions",
        localField: "competition",
        foreignField: "_id",
        as: "competition",
      },
    },
    { $unwind: "$competition" },
    { $sort: { start_date: -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const createData = {
    ...req.body,
  };

  const data = await Season.create(createData);
  const populatedData = await Season.findById(data._id).populate("competition");
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
  const data = await Season.findById(id).populate("competition");
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

  const updated = await Season.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

  // update
  const populated = await Season.findById(updated._id).populate("competition");
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const team = await Season.findOneAndDelete({ _id: id });
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
