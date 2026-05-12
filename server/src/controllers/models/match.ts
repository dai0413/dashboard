import { StatusCodes } from "http-status-codes";
import { Response } from "express";

import { crudFactory } from "../factories/crudFactory.js";

import { parseObjectId } from "../../csvImport/utils/parseObjectId.js";
import { parseDateJST } from "../../csvImport/utils/parseDateJST.js";
import csv from "csv-parser";
import { match as createConfig } from "@dai0413/myorg-shared/models-config";
import { MatchModel as Model } from "../../models/match.js";
import { getNest } from "../../utils/getNest.js";
import { convertObjectIdToString } from "../../utils/convertObjectIdToString.js";
import { match as customMatch } from "../../utils/customMatchStage/match.js";
import { DecodedRequest } from "../../types/types.js";
import { createController } from "../factories/createController.js";
import z from "zod";

const config = createConfig(Model, customMatch);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  createController(config);

const {
  MONGO_MODEL,
  SCHEMA: { DATA, POPULATED },
  POPULATE_PATHS,
  convertFun,
} = config;

const uploadItem = async (req: DecodedRequest, res: Response) => {
  type TYPE = z.infer<typeof DATA>;

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
        competition_stage: parseObjectId(row.competition_stage),
        home_team: parseObjectId(row.home_team),
        away_team: parseObjectId(row.away_team),
        match_format: row.match_format
          ? parseObjectId(row.match_format)
          : undefined,
        stadium: row.stadium ? parseObjectId(row.stadium) : undefined,
        stadium_name: row.stadium_name ? row.stadium_name : undefined,
        date: row.date
          ? parseDateJST(row.date as unknown as string)
          : undefined,
        audience: row.audience ? row.audience : undefined,
        home_goal: row.home_goal ? row.home_goal : undefined,
        away_goal: row.away_goal ? row.away_goal : undefined,
        home_pk_goal: row.home_pk_goal ? row.home_pk_goal : undefined,
        away_pk_goal: row.away_pk_goal ? row.away_pk_goal : undefined,
        match_week: row.match_week ? row.match_week : undefined,
        weather: row.weather ? row.weather : undefined,
        temperature: row.temperature ? row.temperature : undefined,
        humidity: row.humidity ? row.humidity : undefined,
        transferurl: row.transferurl ? row.transferurl : undefined,
        sofaurl: row.sofaurl ? row.sofaurl : undefined,
        urls: row.urls ? row.urls : undefined,
        old_id: row.old_id ? row.old_id : undefined,
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

          if (!convertFun) console.error("error convert fun");
          const formattedTransfers = convertFun ? convertFun(parsed) : [];

          return formattedTransfers;
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
