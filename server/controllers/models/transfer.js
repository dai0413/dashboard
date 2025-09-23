const Player = require("../models/player");
const { formatTransfer } = require("../../utils/format");

const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");

const { getNest } = require("../../utils/getNest");
const {
  transfer: { MODEL, POPULATE_PATHS, bulk },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

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
  const transfer = await MODEL.findById(id);
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

const getAllItems = async (req, res) => {
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

  const data = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    { $limit: parseInt(req.query.limit, 10) || 10000 },
    ...getNestField(false),
    { $sort: { doa: -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: data.map(formatTransfer) });
};

const createItem = async (req, res) => {
  const { from_team_name, to_team_name, from_team, to_team, player } = req.body;
  let transferData = { ...req.body };

  if (!from_team_name && !from_team && !to_team_name && !to_team)
    throw new BadRequestError("移籍元または移籍先のチームを選択してください");

  if (from_team && from_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");

  if (to_team && to_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");

  validateNewTransferDates(transferData);
  // await dateValidation(transferId, updatedData);
  const transfer = await MODEL.create(transferData);

  const populatedTransfer = await MODEL.findById(transfer._id).populate(
    getNestField(true)
  );
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: formatTransfer(populatedTransfer) });
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
    data: formatTransfer(data),
  });
};

const updateItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }

  const {
    params: { id },
  } = req;
  const { from_team_name, to_team_name, from_team, to_team, player } = req.body;
  let updatedData = { ...req.body };

  // from_team
  if (from_team && from_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");

  // to_team
  if (to_team && to_team_name)
    throw new BadRequestError("移籍先チームを選択または入力してください");

  // player
  if (player && !mongoose.Types.ObjectId.isValid(player)) {
    const playerObj = await Player.findById(player);
    if (!playerObj) {
      throw new BadRequestError("player が見つかりません。");
    }
    updatedData.player = playerObj._id;
  }

  // date validation
  await dateValidation(id, updatedData);

  // update
  const updated = await MODEL.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }
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

  const data = await MODEL.findOneAndDelete({ _id: id });
  if (!data) {
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
