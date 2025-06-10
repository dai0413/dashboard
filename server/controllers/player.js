const Player = require("../models/player");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllPlayers = async (req, res) => {
  const players = await Player.find({});
  res.status(StatusCodes.OK).json({ data: players });
};

const checkSimilarPlayers = async (req, res) => {
  if (!req.body.name || !req.body.en_name || !req.body.dob || !req.body.pob) {
    throw new BadRequestError();
  }
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
    return res.status(StatusCodes.OK).json({
      message: "類似する選手が存在します。追加しますか？",
      existing_players: existing_players,
    });
  } else {
    createPlayer(req, res);
  }
};

const createPlayer = async (req, res) => {
  if (!req.body.name || !req.body.en_name || !req.body.dob || !req.body.pob) {
    throw new BadRequestError();
  }
  const { name, en_name, dob, pob } = req.body;
  const player = await Player.create(req.body);
  if (!player) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({ message: "追加しました", data: player });
};

const getPlayer = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: playerId },
  } = req;
  const player = await Player.findById(playerId);
  if (!player) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({ data: player });
};

const updatePlayer = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: playerId },
  } = req;

  const updated = await Player.findByIdAndUpdate(playerId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!player) {
    throw new NotFoundError();
  }

  const populated = await Player.findById(updated._id);
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deletePlayer = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: playerId },
  } = req;

  const player = await Player.findOneAndDelete({ _id: playerId });
  if (!player) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

module.exports = {
  getAllPlayers,
  createPlayer,
  checkSimilarPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
};
