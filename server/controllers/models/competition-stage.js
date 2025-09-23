const CompetitionStage = require("../models/competition-stage");
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

  if (req.query.season) {
    try {
      matchStage.season = new mongoose.Types.ObjectId(req.query.season);
    } catch {
      return res.status(400).json({ error: "Invalid season ID" });
    }
  }

  const dat = await CompetitionStage.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $lookup: {
        from: "competitions",
        localField: "competition",
        foreignField: "_id",
        as: "competition",
      },
    },
    { $unwind: { path: "$competition", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "seasons",
        localField: "season",
        foreignField: "_id",
        as: "season",
      },
    },
    { $unwind: { path: "$season", preserveNullAndEmptyArrays: true } },
    { $sort: { _id: 1, order: 1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const createData = {
    ...req.body,
  };

  const data = await CompetitionStage.create(createData);
  const populatedData = await CompetitionStage.findById(data._id)
    .populate("competition")
    .populate("season");
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
  const data = await CompetitionStage.findById(id)
    .populate("competition")
    .populate("season");
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

  const updated = await CompetitionStage.findByIdAndUpdate(
    { _id: id },
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
  const populated = await CompetitionStage.findById(updated._id)
    .populate("competition")
    .populate("season");
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const team = await CompetitionStage.findOneAndDelete({ _id: id });
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
