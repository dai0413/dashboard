import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../../errors/index.js";
import csv from "csv-parser";

import { getNest } from "../../utils/getNest.js";

import { player } from "../../modelsConfig/index.js";
const { MODEL, POPULATE_PATHS, bulk } = player;

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  const data = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { _id: 1, order: 1 } },
  ]);

  res.status(StatusCodes.OK).json({ data });
};

const checkItem = async (req, res) => {
  if (!req.body.name || !req.body.en_name || !req.body.dob || !req.body.pob) {
    throw new BadRequestError();
  }
  const { name, en_name, dob, pob } = req.body;
  // 類似選手検索
  const similar = await MODEL.find({
    $or: [{ name: name }, { en_name: en_name }, { dob: dob }],
  });

  // 類似選手あり
  if (similar.length > 0) {
    const existing = similar.map((p) => ({
      _id: p._id,
      name: p.name,
      en_name: p.en_name || "",
      dob: p.dob ? p.dob.toISOString().split("T")[0] : "",
    }));
    return res.status(StatusCodes.OK).json({
      message: "類似する選手が存在します。追加しますか？",
      existing: existing,
    });
  } else {
    createItem(req, res);
  }
};

const createItem = async (req, res) => {
  let populatedData;
  if (bulk && Array.isArray(req.body)) {
    const docs = await MODEL.insertMany(req.body);

    const ids = docs.map((doc) => doc._id);
    populatedData = await MODEL.find({ _id: { $in: ids } }).populate(
      getNestField(true)
    );
  } else {
    const data = await MODEL.create(req.body);
    populatedData = await MODEL.findById(data._id).populate(getNestField(true));
  }
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: populatedData });
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
  res.status(StatusCodes.OK).json({ data });
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

const uploadItem = async (req, res) => {
  const existingCount = await MODEL.countDocuments();
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
        const addedPlayers = await MODEL.insertMany(playersToAdd);
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

import moment from "moment";

const downloadItem = async (req, res) => {
  try {
    const players = await MODEL.find();
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

export {
  getAllItems,
  createItem,
  checkItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  downloadItem,
};
