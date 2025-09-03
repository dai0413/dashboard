const TeamCompetitionSeason = require("../models/team-competition-season");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllItems = async (req, res) => {
  const datas = await TeamCompetitionSeason.find({})
    .populate("team")
    .populate("season")
    .populate("competition");

  res.status(StatusCodes.OK).json({ data: datas });
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
