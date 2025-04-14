const Transfer = require("../models/transfer");
const Team = require("../models/team");
const Player = require("../models/player");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllTransfer = async (req, res) => {
  const transfers = await Transfer.find({});
  res.status(StatusCodes.OK).json({ data: transfers });
};

const createTransfer = async (req, res) => {
  if (!req.body.from_team || !req.body.to_team) {
    throw new BadRequestError();
  }
  const { from_team, to_team } = req.body;

  const fromTeamObj = await Team.findOne({ abbr: from_team });
  const toTeamObj = await Team.findOne({ abbr: to_team });

  if (!fromTeamObj || !toTeamObj) {
    throw new NotFoundError();
  }

  const transferData = {
    ...req.body,
    from_team: fromTeamObj._id,
    to_team: toTeamObj._id,
  };

  const transfer = await Transfer.create(transferData);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: transfer });
};

const getTransfer = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }

  const {
    params: { id: transferId },
  } = req;
  const transfer = await Transfer.findById(transferId);
  if (!transfer) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ data: transfer });
};

const updateTransfer = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }

  const {
    params: { id: transferId },
    body,
  } = req;

  const updatedData = { ...body };

  // from_team
  if (body.from_team && !mongoose.Types.ObjectId.isValid(body.from_team)) {
    const fromTeamObj = await Team.findOne({ abbr: body.from_team });
    if (!fromTeamObj) {
      throw new BadRequestError("from_team が見つかりません。");
    }
    updatedData.from_team = fromTeamObj._id;
  }

  // to_team
  if (body.to_team && !mongoose.Types.ObjectId.isValid(body.to_team)) {
    const toTeamObj = await Team.findOne({ abbr: body.to_team });
    if (!toTeamObj) {
      throw new BadRequestError("to_team が見つかりません。");
    }
    updatedData.to_team = toTeamObj._id;
  }

  // player
  if (body.player && !mongoose.Types.ObjectId.isValid(body.player)) {
    const playerObj = await Player.findOne({ abbr: body.player });
    if (!playerObj) {
      throw new BadRequestError("player が見つかりません。");
    }
    updatedData.player = playerObj._id;
  }

  const transfer = await Transfer.findByIdAndUpdate(
    { _id: transferId },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!transfer) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({ message: "編集しました" });
};

const deleteTransfer = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }

  const {
    params: { id: transferId },
  } = req;

  const transfer = await Transfer.findOneAndDelete({ _id: transferId });
  if (!transfer) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

module.exports = {
  getAllTransfer,
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
};
