const Player = require("../models/player");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const csv = require("csv-parser");

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
  if (!req.body.name || !req.body.dob || !req.body.pob) {
    throw new BadRequestError();
  }

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

const uploadPlayer = async (req, res) => {
  const existingCount = await Player.countDocuments();
  const rows = [];

  req.decodedStream
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      if (existingCount >= rows.length) {
        return res.status(StatusCodes.OK).json({
          message: "追加する選手データはありません（すでに全件登録済み）",
          data: [],
        });
      }

      const newRows = rows.slice(existingCount); // 追加分だけ
      const playersToAdd = newRows.map((row) => ({
        name: row.name,
        en_name: row.en_name,
        dob: row.dob,
        pob: row.pob,
      }));

      try {
        const addedPlayers = await Player.insertMany(playersToAdd);
        res.status(StatusCodes.OK).json({
          message: `${addedPlayers.length}件の選手を追加しました`,
          data: addedPlayers,
        });
      } catch (err) {
        console.error("保存エラー:", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "保存中にエラーが発生しました" });
      }
    });
};

const moment = require("moment");

const downloadPlayer = async (req, res) => {
  try {
    const players = await Player.find();
    if (players.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"player_id","name","en_name","dob","pob"\n`;

    const csvContent = players
      .map((player, index) => {
        const dob = player.dob ? moment(player.dob).format("YYYY/MM/DD") : ""; // 空でも対応
        return `"${index + 1}","${player.name}","${player.en_name}","${dob}","${
          player.pob
        }"`;
      })
      .join("\n");

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("players.csv");
    res.status(StatusCodes.OK).send("\uFEFF" + header + csvContent); // 先頭にBOMをつけてExcel文字化け防止
  } catch (err) {
    console.error("CSV出力エラー:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "CSV出力に失敗しました" });
  }
};

module.exports = {
  getAllPlayers,
  createPlayer,
  checkSimilarPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
  uploadPlayer,
  downloadPlayer,
};
