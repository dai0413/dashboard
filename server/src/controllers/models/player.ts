import { StatusCodes } from "http-status-codes";
import csv from "csv-parser";
import { Request, Response } from "express";
import moment from "moment";
import { BadRequestError } from "../../errors/index.js";

import { player as createConfig } from "@dai0413/myorg-shared/models-config";
import { DecodedRequest } from "../../types.js";
import { crudFactory } from "../../utils/crudFactory.js";
import { PlayerModel as Model } from "../../models/player.js";
import { parseDateJST } from "../../csvImport/utils/parseDateJST.js";
import z from "zod";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

const {
  SCHEMA: { DATA },
} = config;

type TYPE = z.infer<typeof DATA>;

const checkItem = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.en_name || !req.body.dob || !req.body.pob) {
    throw new BadRequestError();
  }
  const { name, en_name, dob } = req.body;
  // 類似選手検索
  const similar = await Model.find({
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
  const existingCount = await Model.countDocuments();
  const rows: TYPE[] = [];

  req.decodedStream
    .pipe(csv())
    .on("data", (row: TYPE) => {
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
        dob: parseDateJST(row.dob),
        pob: row.pob,
      }));

      try {
        const addedPlayers = await Model.insertMany(playersToAdd);
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

const safe = (value: any) => {
  if (value === undefined || value === null) return "";
  return String(value);
};

const downloadItem = async (req: Request, res: Response) => {
  try {
    const data = await Model.aggregate([
      {
        $addFields: {
          // old_id があるかどうか（true / false）
          has_old_id: {
            $cond: [{ $ifNull: ["$old_id", false] }, 0, 1],
            // old_idあり → 0（先）
            // old_idなし → 1（後）
          },

          // old_id を数値化（失敗しても落ちない）
          old_id_num: {
            $convert: {
              input: "$old_id",
              to: "int",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $sort: {
          has_old_id: 1, // ① old_idあり → なし
          old_id_num: 1, // ② old_id 昇順（数値）
          createdAt: 1, // ③ old_id がないものは createdAt 昇順
        },
      },
    ]);

    if (data.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"old_id","name","en_name","dob","pob"\n`;

    const csvContent = data
      .map((player: any, index: number) => {
        const dob = player.dob
          ? moment.utc(player.dob).add(9, "hours").format("YYYY/MM/DD")
          : "";
        return `"${safe(player.old_id)}","${player.name}","${safe(
          player.en_name,
        )}","${dob}","${safe(player.pob)}"`;
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
