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

  if (newTo && newFrom && newTo <= newFrom) {
    throw new BadRequestError(
      "満了予定日 は 新チーム加入日 より後でなければなりません。"
    );
  }
};

const getAllTransfer = async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  const player = req.query.player ? req.query.player : null;
  const team = req.query.team ? req.query.team : null;
  const from_team = req.query.from_team ? req.query.from_team : null;
  const to_team = req.query.to_team ? req.query.to_team : null;
  const form = req.query.form ? req.query.form : null;
  const fromDateAfter = req.query.from_date_after
    ? new Date(req.query.from_date_after)
    : null;
  const toDateBefore = req.query.to_date_before
    ? new Date(req.query.to_date_before)
    : null;

  if (isNaN(limit) || limit <= 0) {
    limit = undefined;
  }

  const condition = {};
  if (player) condition.player = player;
  if (team) {
    condition.$or = [{ from_team: team }, { to_team: team }];
  } else {
    if (from_team) {
      condition.from_team = from_team;
    }
    if (to_team) {
      condition.to_team = to_team;
    }
  }

  if (form) {
    const isNegated = form.startsWith("!");
    const values = (isNegated ? form.slice(1) : form).split(",");

    condition.form = isNegated ? { $nin: values } : { $in: values };
  }

  // from_date の下限指定
  if (fromDateAfter) {
    condition.from_date = { $gte: fromDateAfter };
  }

  // to_date の上限指定
  if (toDateBefore) {
    condition.to_date = { $lte: toDateBefore };
  }

  let query = Transfer.find(condition).sort({ doa: -1, _id: -1 });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const transfers = await query
    .populate("from_team")
    .populate("to_team")
    .populate("player");

  const formattedTransfers = transfers.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const createTransfer = async (req, res) => {
  const { from_team_name, to_team_name, from_team, to_team, player } = req.body;
  let transferData = { ...req.body };

  if (!from_team_name && !from_team && !to_team_name && !to_team)
    throw new BadRequestError("移籍元または移籍先のチームを選択してください");

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
  } = req;
  const { from_team_name, to_team_name, from_team, to_team, player } = req.body;
  let updatedData = { ...req.body };

  // from_team
  if (from_team && from_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");
  if (from_team && !mongoose.Types.ObjectId.isValid(from_team)) {
    const fromTeamObj = await Team.findById(from_team);
    if (!fromTeamObj) {
      throw new BadRequestError("移籍元 が見つかりません。");
    }
    updatedData.from_team = fromTeamObj._id;
  }

  // to_team
  if (to_team && to_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");
  if (to_team && !mongoose.Types.ObjectId.isValid(to_team)) {
    const toTeamObj = await Team.findById(to_team);
    if (!toTeamObj) {
      throw new BadRequestError("移籍先 が見つかりません。");
    }
    updatedData.to_team = toTeamObj._id;
  }

  // player
  if (player && !mongoose.Types.ObjectId.isValid(player)) {
    const playerObj = await Player.findById(player);
    if (!playerObj) {
      throw new BadRequestError("player が見つかりません。");
    }
    updatedData.player = playerObj._id;
  }

  // date validation
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
