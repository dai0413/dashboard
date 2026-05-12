import csv from "csv-parser";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { teamCompetitionSeason as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../factories/crudFactory.js";
import { TeamCompetitionSeasonModel as Model } from "../../models/team-competition-season.js";
import { DecodedRequest } from "../../types/types.js";
import { parseObjectId } from "../../csvImport/utils/parseObjectId.js";
import { getNest } from "../../utils/getNest.js";
import { convertObjectIdToString } from "../../utils/convertObjectIdToString.js";
import z from "zod";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

const {
  MONGO_MODEL,
  SCHEMA: { DATA, POPULATED },
  POPULATE_PATHS,
} = config;

type TYPE = z.infer<typeof DATA>;

const uploadItem = async (req: DecodedRequest, res: Response) => {
  const rows: TYPE[] = [];

  req.decodedStream
    .pipe(
      csv({
        mapHeaders: ({ header }) => header.replace(/'/g, "").trim(),
      }),
    )
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      const toAdd = rows.map((row) => ({
        team: parseObjectId(row.team),
        season: parseObjectId(row.season),
      }));

      try {
        const added = await MONGO_MODEL.insertMany(toAdd, { ordered: false });

        // populate用にIDを集めて find する
        const populatedAdded = await MONGO_MODEL.find({
          _id: { $in: added.map((a: any) => a._id) },
        }).populate(getNest(true, POPULATE_PATHS));

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
          const failed = err.writeErrors.map((e: any) => ({
            index: e.index,
            code: e.code,
            errmsg: e.errmsg,
          }));

          res.status(StatusCodes.PARTIAL_CONTENT).json({
            message: `${toAdd.length - failed.length}件追加に成功、${
              failed.length
            }件失敗`,
          });
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "保存中にエラーが発生しました" });
        }
      }
    });
};

export { getAllItems, createItem, getItem, updateItem, deleteItem, uploadItem };
