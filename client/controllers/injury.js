const Injury = require("../models/injury");
const Transfer = require("../models/transfer");
const Player = require("../models/player");
const Team = require("../models/team");

const getAllInjury = async (req, res) => {
  const injurys = await Injury.find({});
  res.status(200).json({ data: injurys });
};

const createInjury = async (req, res) => {
  const { team, player } = req.body;

  const playerObj = await Player.findOne({ abbr: player });
  if (!playerObj) {
    return res
      .status(404)
      .json({ message: "登録されていない選手が選択されています" });
  }

  const teamObj = await Team.findOne({ abbr: team });

  if (!teamObj) {
    return res
      .status(404)
      .json({ message: "登録されていないチームが選択されています" });
  }

  const now_teamObj = await Transfer.findOne({
    player: playerObj._id,
    to_team: { $ne: null }, // to_team が null でない
  })
    .sort({ from_date: -1 }) // 最新
    .limit(1);

  const injuryData = {
    ...req.body,
    team: teamObj._id,
    now_team: now_teamObj ? now_teamObj.to_team : null,
    player: playerObj._id,
  };

  const injury = await Injury.create(injuryData);
  res.status(200).json({ message: "追加しました", data: injury });
};

const getInjury = async (req, res) => {
  const {
    params: { id: injuryId },
  } = req;
  const injury = await Injury.findById(injuryId);
  res.status(200).json({ data: injury });
};

const updateInjury = async (req, res) => {
  const {
    params: { id: injuryId },
    body,
  } = req;

  const updatedData = { ...body };

  // team
  if (body.team && !mongoose.Types.ObjectId.isValid(body.team)) {
    const teamObj = await Team.findOne({ abbr: body.team });
    if (!teamObj) {
      return res.status(404).json({ message: "team が見つかりません" });
    }
    updatedData.team = teamObj._id;
  }

  // player
  if (body.player && !mongoose.Types.ObjectId.isValid(body.player)) {
    const playerObj = await Player.findOne({ abbr: body.player });
    if (!playerObj) {
      return res.status(404).json({ message: "player が見つかりません" });
    }
    updatedData.player = playerObj._id;
  }

  const injury = await Injury.findByIdAndUpdate(
    { _id: injuryId },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ message: "編集しました" });
};

const deleteInjury = async (req, res) => {
  const {
    params: { id: injuryId },
  } = req;

  const injury = await Injury.findOneAndDelete({ _id: injuryId });

  res.status(200).json({ message: "削除しました" });
};

module.exports = {
  getAllInjury,
  createInjury,
  getInjury,
  updateInjury,
  deleteInjury,
};
