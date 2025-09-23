const Transfer = require("../models/transfer");
const Team = require("../models/team");
const Player = require("../models/player");
const { formatTransfer } = require("../../utils/format");

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");

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
  const matchStage = {};

  // player, team, from_team, to_team, form, fromDateAfter, toDateBefore を matchStage に設定
  if (req.query.player)
    matchStage.player = new mongoose.Types.ObjectId(req.query.player);

  if (req.query.team)
    matchStage.$or = [
      { from_team: new mongoose.Types.ObjectId(req.query.team) },
      { to_team: new mongoose.Types.ObjectId(req.query.team) },
    ];
  if (req.query.from_team)
    matchStage.from_team = new mongoose.Types.ObjectId(req.query.from_team);
  if (req.query.to_team)
    matchStage.to_team = new mongoose.Types.ObjectId(req.query.to_team);
  if (req.query.form) {
    const isNegated = req.query.form.startsWith("!");
    const values = (isNegated ? req.query.form.slice(1) : req.query.form).split(
      ","
    );
    matchStage.form = isNegated ? { $nin: values } : { $in: values };
  }
  if (req.query.from_date_after)
    matchStage.from_date = { $gte: new Date(req.query.from_date_after) };
  if (req.query.to_date_before)
    matchStage.to_date = { $lte: new Date(req.query.to_date_before) };

  const pipeline = [
    { $match: matchStage },
    { $sort: { doa: -1, _id: -1 } },
    { $limit: parseInt(req.query.limit, 10) || 10000 },
    {
      $lookup: {
        from: "players",
        localField: "player",
        foreignField: "_id",
        as: "player",
      },
    },
    { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "teams",
        localField: "from_team",
        foreignField: "_id",
        as: "from_team",
      },
    },
    { $unwind: { path: "$from_team", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "teams",
        localField: "to_team",
        foreignField: "_id",
        as: "to_team",
      },
    },
    { $unwind: { path: "$to_team", preserveNullAndEmptyArrays: true } },
  ];

  const transfers = await Transfer.aggregate(pipeline);
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
