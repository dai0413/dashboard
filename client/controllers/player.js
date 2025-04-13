const Player = require("../models/player");

const getAllPlayers = async (req, res) => {
  const players = await Player.find({});
  res.status(200).json({ data: players });
};

const checkSimilarPlayers = async (req, res) => {
  const { name, en_name, dob, pob } = req.body;

  // 類似選手検索
  const similarPlayers = await Player.find({
    $or: [{ name: name }, { en_name: en_name }, { dob: dob }],
  });

  // 類似選手あり
  if (similarPlayers.length > 0) {
    const existing_players = similarPlayers.map((p) => ({
      _id: p._id,
      name: p.name,
      en_name: p.en_name || "",
      dob: p.dob ? p.dob.toISOString().split("T")[0] : "",
    }));
    return res.status(200).json({
      message: "類似する選手が存在します。追加しますか？",
      existing_players: existing_players,
    });
  } else {
    createPlayer(req, res);
  }
};

const createPlayer = async (req, res) => {
  const player = await Player.create(req.body);
  res.status(200).json({ message: "追加しました", data: player });
};

const getPlayer = async (req, res) => {
  const {
    params: { id: playerId },
  } = req;
  const player = await Player.findById(playerId);
  res.status(200).json({ data: player });
};

const updatePlayer = async (req, res) => {
  const {
    params: { id: playerId },
  } = req;

  const player = await Player.findByIdAndUpdate({ _id: playerId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "編集しました" });
};

const deletePlayer = async (req, res) => {
  const {
    params: { id: playerId },
  } = req;

  const player = await Player.findOneAndDelete({ _id: playerId });

  res.status(200).json({ message: "削除しました" });
};

module.exports = {
  getAllPlayers,
  createPlayer,
  checkSimilarPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
};
