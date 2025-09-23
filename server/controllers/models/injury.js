const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const { formatInjury } = require("../../utils/format");
const { getNest } = require("../../utils/getNest");
const {
  injury: { MODEL, POPULATE_PATHS },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  if (req.query.player) {
    try {
      matchStage.player = new mongoose.Types.ObjectId(req.query.player);
    } catch {
      return res.status(400).json({ error: "Invalid player ID" });
    }
  }

  if (req.query.now_team) {
    try {
      matchStage.now_team = new mongoose.Types.ObjectId(req.query.now_team);
    } catch {
      return res.status(400).json({ error: "Invalid now_team ID" });
    }
  }

  if (req.query.limit) {
    try {
      matchStage.limit = parseInt(req.query.limit, 10);
    } catch {
      return res.status(400).json({ error: "Invalid limit" });
    }
  }

  const data = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { doa: -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: data });
};

const createItem = async (req, res) => {
  const { team, team_name, player } = req.body;
  let injuryData = { ...req.body };

  if (!team && !team_name) {
    throw new BadRequestError("チームを選択または入力してください");
  }

  if (!player) {
    throw new BadRequestError("選手を選択してください");
  }

  if (team && team_name)
    throw new BadRequestError("チームを選択または入力してください");

  const injury = await MODEL.create(injuryData);

  const populatedInjury = await MODEL.findById(injury._id).populate(
    getNestField(true)
  );
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: formatInjury(populatedInjury) });
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

  const updated = await MODEL.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

  // update
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
