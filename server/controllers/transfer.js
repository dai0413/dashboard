const Transfer = require("../models/transfer");
const Team = require("../models/team");
const Player = require("../models/player");
const { formatTransfer } = require("../utils/formatTransfer");

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const validateNewTransferDates = (data) => {
  const from = data.from_date ? new Date(data.from_date) : null;
  const to = data.to_date ? new Date(data.to_date) : null;

  if (!from || isNaN(from.getTime())) {
    throw new BadRequestError("新チーム加入日 が正しく設定されていません。");
  }

  if (to && isNaN(to.getTime())) {
    throw new BadRequestError("満了予定日 が正しく設定されていません。");
  }

  if (to && from && to <= from) {
    throw new BadRequestError(
      "満了予定日 は 新チーム加入日 より後でなければなりません。"
    );
  }
};

const dateValidation = async (id, newData) => {
  const transfer = await Transfer.findById(id);
  if (!transfer) throw new NotFoundError();

  const currentFrom = transfer.from_date;
  const currentTo = transfer.to_date;

  const newFrom =
    "from_date" in newData ? new Date(newData.from_date) : currentFrom;
  const newTo = "to_date" in newData ? new Date(newData.to_date) : currentTo;

  if (isNaN(newFrom.getTime()) || isNaN(newTo.getTime())) {
    throw new BadRequestError("日付の形式が正しくありません。");
  }

  if (newTo && newFrom && newTo <= newFrom) {
    throw new BadRequestError(
      "満了予定日 は 新チーム加入日 より後でなければなりません。"
    );
  }
};

const getAllTransfer = async (req, res) => {
  const transfers = await Transfer.find({})
    .sort({ doa: -1 })
    .populate("from_team")
    .populate("to_team")
    .populate("player");

  const formattedTransfers = transfers.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const createTransfer = async (req, res) => {
  const { from_team_name, to_team_name, from_team, to_team, player } = req.body;

  if (!from_team_name && !from_team && !to_team_name && !to_team)
    throw new BadRequestError("移籍元または移籍先のチームを選択してください");

  let transferData = { ...req.body };

  if (from_team && from_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");

  // from_team
  if (from_team) {
    let fromTeamId = null;
    if (from_team) {
      if (!mongoose.Types.ObjectId.isValid(from_team)) {
        throw new BadRequestError("移籍元 の ID が不正です。");
      }
      const team = await Team.findById(from_team);
      if (!team) {
        throw new BadRequestError("移籍元 が見つかりません。");
      }
      fromTeamId = team._id;
    }

    transferData.from_team = fromTeamId;
  } else if (from_team_name) {
    transferData.from_team_name = from_team_name;
  }

  if (to_team && to_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");

  // to_team
  if (to_team) {
    let toTeamId = null;
    if (to_team) {
      if (!mongoose.Types.ObjectId.isValid(to_team)) {
        throw new BadRequestError("移籍先 の ID が不正です。");
      }
      const team = await Team.findById(to_team);
      if (!team) {
        throw new BadRequestError("移籍先 が見つかりません。");
      }
      toTeamId = team._id;
    }

    transferData.to_team = toTeamId;
  } else if (to_team_name) {
    transferData.to_team_name = to_team_name;
  }

  if (!mongoose.Types.ObjectId.isValid(player)) {
    throw new BadRequestError("player の ID が不正です。");
  }

  validateNewTransferDates(transferData);
  const transfer = await Transfer.create(transferData);

  const populatedTransfer = await Transfer.findById(transfer._id)
    .populate("from_team")
    .populate("to_team")
    .populate("player");
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: formatTransfer(populatedTransfer) });
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

  res.status(StatusCodes.OK).json({ data: formatTransfer(transfer) });
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
  if ("from_team" in body && !mongoose.Types.ObjectId.isValid(body.from_team)) {
    const fromTeamObj = await Team.findById(body.from_team);
    if (!fromTeamObj) {
      throw new BadRequestError("移籍元 が見つかりません。");
    }
    updatedData.from_team = fromTeamObj._id;
  }

  // to_team
  if ("to_team" in body && !mongoose.Types.ObjectId.isValid(body.to_team)) {
    const toTeamObj = await Team.findById(body.to_team);
    if (!toTeamObj) {
      throw new BadRequestError("移籍先 が見つかりません。");
    }
    updatedData.to_team = toTeamObj._id;
  }

  // player
  if ("player" in body && !mongoose.Types.ObjectId.isValid(body.player)) {
    const playerObj = await Player.findById(body.player);
    if (!playerObj) {
      throw new BadRequestError("player が見つかりません。");
    }
    updatedData.player = playerObj._id;
  }

  await dateValidation(transferId, updatedData);

  // update
  const updatedTransfer = await Transfer.findByIdAndUpdate(
    { _id: transferId },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedTransfer) {
    throw new NotFoundError();
  }
  const populated = await Transfer.findById(updatedTransfer._id)
    .populate("from_team")
    .populate("to_team")
    .populate("player");

  res
    .status(StatusCodes.OK)
    .json({ message: "編集しました", data: formatTransfer(populated) });
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
