import { StatusCodes } from "http-status-codes";
import csv from "csv-parser";
import { Request, Response } from "express";
import moment from "moment";
import { BadRequestError } from "../../errors/index.ts";

import { player } from "../../../shared/dist/models-config/player.js";
import { DecodedRequest } from "../../types.ts";
import { crudFactory } from "../../utils/crudFactory.ts";

const { MONGO_MODEL, TYPE } = player;

const getAllItems = crudFactory(player).getAllItems;
const createItem = crudFactory(player).createItem;
const getItem = crudFactory(player).getItem;
const updateItem = crudFactory(player).updateItem;
const deleteItem = crudFactory(player).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage = {};

//   const data = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { _id: 1, order: 1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data });
// };

// const createItem = async (req: Request, res: Response) => {
//   let populatedData;
//   if (bulk && Array.isArray(req.body)) {
//     const docs = await MONGO_MODEL.insertMany(req.body);

//     const ids = docs.map((doc) => doc._id);
//     populatedData = await MONGO_MODEL.find({
//       _id: { $in: ids },
//     }).populate(getNest(true, POPULATE_PATHS));
//   } else {
//     const data = await MONGO_MODEL.create(req.body);
//     populatedData = await MONGO_MODEL.findById(data._id).populate(
//       getNest(true, POPULATE_PATHS)
//     );
//   }
//   res
//     .status(StatusCodes.CREATED)
//     .json({ message: "追加しました", data: populatedData });
// };

// const getItem = async (req: Request, res: Response) => {
//   if (!req.params.id) {
//     throw new BadRequestError();
//   }
//   const {
//     params: { id },
//   } = req;
//   const data = await MONGO_MODEL.findById(id).populate(
//     getNest(true, POPULATE_PATHS)
//   );
//   if (!data) {
//     throw new NotFoundError();
//   }
//   res.status(StatusCodes.OK).json({ data });
// };

// const updateItem = async (req: Request, res: Response) => {
//   if (!req.params.id) {
//     throw new BadRequestError();
//   }
//   const {
//     params: { id },
//   } = req;

//   const updated = await MONGO_MODEL.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!updated) {
//     throw new NotFoundError();
//   }

//   const populated = await MONGO_MODEL.findById(updated._id).populate(
//     getNest(true, POPULATE_PATHS)
//   );
//   res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
// };

// const deleteItem = async (req: Request, res: Response) => {
//   if (!req.params.id) {
//     throw new BadRequestError();
//   }
//   const {
//     params: { id },
//   } = req;

//   const data = await MONGO_MODEL.findOneAndDelete({ _id: id });
//   if (!data) {
//     throw new NotFoundError();
//   }
//   res.status(StatusCodes.OK).json({ message: "削除しました" });
// };

const checkItem = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.en_name || !req.body.dob || !req.body.pob) {
    throw new BadRequestError();
  }
  const { name, en_name, dob } = req.body;
  // 類似選手検索
  const similar = await MONGO_MODEL.find({
    $or: [{ name: name }, { en_name: en_name }, { dob: dob }],
  });

  // 類似選手あり
  if (similar.length > 0) {
    const existing = similar.map((p: any) => ({
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

const uploadItem = async (req: DecodedRequest, res: Response) => {
  const existingCount = await MONGO_MODEL.countDocuments();
  const rows: (typeof TYPE)[] = [];

  req.decodedStream
    .pipe(csv())
    .on("data", (row: typeof TYPE) => {
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
        const addedPlayers = await MONGO_MODEL.insertMany(playersToAdd);
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

const downloadItem = async (req: Request, res: Response) => {
  try {
    const data = await MONGO_MODEL.find();
    if (data.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"player_id","name","en_name","dob","pob"\n`;

    const csvContent = data
      .map((player: any, index: number) => {
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
