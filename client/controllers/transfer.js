const Transfer = require("../models/transfer");
const Team = require("../models/team");
const Player = require("../models/player");
const mongoose = require("mongoose");

const getAllTransfer = async (req, res) => {
  const transfers = await Transfer.find({});
  res.status(200).json({ data: transfers });
};

const createTransfer = async (req, res) => {
  const { from_team, to_team } = req.body;

  const fromTeamObj = await Team.findOne({ abbr: from_team });
  const toTeamObj = await Team.findOne({ abbr: to_team });

  if (!fromTeamObj || !toTeamObj) {
    return res
      .status(404)
      .json({ message: "登録されていないチームが選択されています" });
  }

  const transferData = {
    ...req.body,
    from_team: fromTeamObj._id,
    to_team: toTeamObj._id,
  };

  const transfer = await Transfer.create(transferData);
  res.status(200).json({ message: "追加しました", data: transfer });
};

const getTransfer = async (req, res) => {
  const {
    params: { id: transferId },
  } = req;
  const transfer = await Transfer.findById(transferId);
  res.status(200).json({ data: transfer });
};

const updateTransfer = async (req, res) => {
  const {
    params: { id: transferId },
    body,
  } = req;

  const updatedData = { ...body };

  // from_team
  if (body.from_team && !mongoose.Types.ObjectId.isValid(body.from_team)) {
    const fromTeamObj = await Team.findOne({ abbr: body.from_team });
    if (!fromTeamObj) {
      return res.status(404).json({ message: "from_team が見つかりません" });
    }
    updatedData.from_team = fromTeamObj._id;
  }

  // to_team
  if (body.to_team && !mongoose.Types.ObjectId.isValid(body.to_team)) {
    const toTeamObj = await Team.findOne({ abbr: body.to_team });
    if (!toTeamObj) {
      return res.status(404).json({ message: "to_team が見つかりません" });
    }
    updatedData.to_team = toTeamObj._id;
  }

  // player
  if (body.player && !mongoose.Types.ObjectId.isValid(body.player)) {
    const playerObj = await Player.findOne({ abbr: body.player });
    if (!playerObj) {
      return res.status(404).json({ message: "player が見つかりません" });
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

  res.status(200).json({ message: "編集しました" });
};

const deleteTransfer = async (req, res) => {
  const {
    params: { id: transferId },
  } = req;

  const transfer = await Transfer.findOneAndDelete({ _id: transferId });

  res.status(200).json({ message: "削除しました" });
};

module.exports = {
  getAllTransfer,
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
};
