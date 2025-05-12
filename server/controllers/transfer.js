const Transfer = require("../models/transfer");
const Team = require("../models/team");
const Player = require("../models/player");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllTransfer = async (req, res) => {
  const transfers = await Transfer.find({})
    .populate("from_team")
    .populate("to_team")
    .populate("player");
  res.status(StatusCodes.OK).json({ data: transfers });
};

const createTransfer = async (req, res) => {
  const { from_team, to_team, player } = req.body;

  // from_team
  let fromTeamId = null;
  if (from_team) {
    if (!mongoose.Types.ObjectId.isValid(from_team)) {
      throw new BadRequestError("from_team の ID が不正です。");
    }
    const team = await Team.findById(from_team);
    if (!team) {
      throw new BadRequestError("from_team が見つかりません。");
    }
    fromTeamId = team._id;
  }

  // to_team
  let toTeamId = null;
  if (to_team) {
    if (!mongoose.Types.ObjectId.isValid(to_team)) {
      throw new BadRequestError("to_team の ID が不正です。");
    }
    const team = await Team.findById(to_team);
    if (!team) {
      throw new BadRequestError("to_team が見つかりません。");
    }
    toTeamId = team._id;
  }

  if (!mongoose.Types.ObjectId.isValid(player)) {
    throw new BadRequestError("player の ID が不正です。");
  }

  const transferData = {
    ...req.body,
    from_team: fromTeamId,
    to_team: toTeamId,
  };

  const transfer = await Transfer.create(transferData);

  const populatedTransfer = await Transfer.findById(transfer._id)
    .populate("from_team")
    .populate("to_team")
    .populate("player");
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: populatedTransfer });
};

const getTransfer = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }

  const {
    params: { id: transferId },
  } = req;
  const transfer = await Transfer.findById(transferId)
    .populate("from_team")
    .populate("to_team")
    .populate("player");

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
    const fromTeamObj = await Team.findById(body.from_team);
    if (!fromTeamObj) {
      throw new BadRequestError("from_team が見つかりません。");
    }
    updatedData.from_team = fromTeamObj._id;
  }

  // to_team
  if (body.to_team && !mongoose.Types.ObjectId.isValid(body.to_team)) {
    const toTeamObj = await Team.findById(body.to_team);
    if (!toTeamObj) {
      throw new BadRequestError("to_team が見つかりません。");
    }
    updatedData.to_team = toTeamObj._id;
  }

  // player
  if (body.player && !mongoose.Types.ObjectId.isValid(body.player)) {
    const playerObj = await Player.findById(body.player);
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
