const TeamCompetitionSeason = require("../models/team-competition-season");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const mongoose = require("mongoose");

const getAllItems = async (req, res) => {
  const matchStage = {};

  if (req.query.team) {
    try {
      matchStage.team = new mongoose.Types.ObjectId(req.query.team);
    } catch {
      return res.status(400).json({ error: "Invalid team ID" });
    }
  }

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

  const dat = await TeamCompetitionSeason.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $lookup: {
        from: "teams",
        localField: "team",
        foreignField: "_id",
        as: "team",
      },
    },
    {
      $lookup: {
        from: "seasons",
        localField: "season",
        foreignField: "_id",
        as: "season",
      },
    },
    {
      $lookup: {
        from: "competitions",
        localField: "competition",
        foreignField: "_id",
        as: "competition",
      },
    },
    { $unwind: "$team" },
    { $unwind: "$season" },
    { $unwind: "$competition" },
    { $sort: { "season.start_date": -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const createData = {
    ...req.body,
  };

  const data = await TeamCompetitionSeason.create(createData);
  const populatedData = await TeamCompetitionSeason.findById(data._id)
    .populate("team")
    .populate("season")
    .populate("competition");
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
  const data = await TeamCompetitionSeason.findById(id)
    .populate("team")
    .populate("season")
    .populate("competition");
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

  const updated = await TeamCompetitionSeason.findByIdAndUpdate(
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
  const populated = await TeamCompetitionSeason.findById(updated._id)
    .populate("team")
    .populate("season")
    .populate("competition");
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const team = await TeamCompetitionSeason.findOneAndDelete({ _id: id });
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
