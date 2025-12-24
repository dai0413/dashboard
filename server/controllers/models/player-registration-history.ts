import { playerRegistrationHistory } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { PlayerRegistrationHistoryModel } from "../../models/player-registration-history.js";

import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { stringify } from "csv-stringify/sync";

import { parseObjectId } from "../../csvImport/utils/parseObjectId.js";
import { parseDateJST } from "../../csvImport/utils/parseDateJST.js";
import { parseBoolean } from "../../csvImport/utils/parseBoolean.js";
import csv from "csv-parser";
import { DecodedRequest } from "types.js";
import { getNest } from "../../utils/getNest.js";
import { convertObjectIdToString } from "../../utils/convertObjectIdToString.js";

const getAllItems = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).getAllItems;
const createItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).createItem;
const getItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).getItem;
const updateItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).updateItem;
const deleteItem = crudFactory(
  playerRegistrationHistory(PlayerRegistrationHistoryModel)
).deleteItem;

const formatDateYMD = (date?: Date): string => {
  if (!date) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}/${m}/${d}`;
};

const {
  MONGO_MODEL,
  SCHEMA: { POPULATED },
  TYPE,
  POPULATE_PATHS,
} = playerRegistrationHistory(PlayerRegistrationHistoryModel);

type FlattenedTYPE = Omit<typeof TYPE, "changes"> & (typeof TYPE)["changes"];

const uploadItem = async (req: DecodedRequest, res: Response) => {
  const rows: FlattenedTYPE[] = [];

  req.decodedStream
    .pipe(
      csv({
        mapHeaders: ({ header }) => header.replace(/'/g, "").trim(),
      })
    )
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      const toAdd = rows.map((row) => {
        return {
          date: parseDateJST(row.date as unknown as string),
          season: parseObjectId(row.season),
          player: parseObjectId(row.player),
          team: parseObjectId(row.team),
          registration_type: row.registration_type,
          changes: {
            number: row.number ? Number(row.number) : undefined,
            position_group: row.position_group ? row.position_group : undefined,
            name: row.name ? row.name : undefined,
            en_name: row.en_name ? row.en_name : undefined,
            height: row.height ? row.height : undefined,
            weight: row.weight ? row.weight : undefined,
            homegrown: row.homegrown ? parseBoolean(row.homegrown) : undefined,
            isTypeTwo: row.isTypeTwo ? parseBoolean(row.isTypeTwo) : undefined,
            isSpecialDesignation: row.isSpecialDesignation
              ? parseBoolean(row.isSpecialDesignation)
              : undefined,
          },
        };
      });

      try {
        const added = await MONGO_MODEL.insertMany(toAdd, { ordered: false });

        // populate用にIDを集めて find する
        const populatedAdded = await MONGO_MODEL.find({
          _id: { $in: added.map((a: any) => a._id) },
        })
          .populate(getNest(true, POPULATE_PATHS))
          .lean();

        const processed = populatedAdded.map((item: any) => {
          const plain = convertObjectIdToString(item);
          const parsed = POPULATED.parse(plain);
          return parsed;
        });

        res.status(StatusCodes.OK).json({
          message: `${populatedAdded.length}件のデータを追加しました`,
          data: processed,
        });
      } catch (err: any) {
        // console.error("保存エラー:", err);

        // MongoBulkWriteError の場合、失敗した行を取り出せる
        if (err.writeErrors) {
          const failedRows = err.writeErrors.map((e: any) => {
            const original = toAdd[e.index];
            const parsedDate = parseDateJST(toAdd[e.index].date);
            const mongoErr = e.err || {};

            return {
              ...original,
              date: formatDateYMD(parsedDate),
              _error_code: e.code ?? mongoErr.code ?? "UNKNOWN",
              _error_message:
                mongoErr.errmsg ??
                mongoErr.message ??
                (mongoErr.keyValue
                  ? `重複キー: ${JSON.stringify(mongoErr.keyValue)}`
                  : "MongoDB書き込みエラー"),
            };
          });

          const csvText = stringify(failedRows, { header: true, quoted: true });
          const bom = "\uFEFF";
          const csvWithBom = bom + csvText;
          const csvBase64 = Buffer.from(csvWithBom, "utf8").toString("base64");

          return res.status(StatusCodes.PARTIAL_CONTENT).json({
            message: `${toAdd.length - failedRows.length}件追加に成功、${
              failedRows.length
            }件失敗`,
            failedCount: failedRows.length,
            csv: csvBase64,
            filename: "failed_rows.csv",
          });
        } else {
          console.log("err", err);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "保存中にエラーが発生しました" });
        }
      }
    });
};

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
