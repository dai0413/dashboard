import { StatusCodes } from "http-status-codes";
import { Response } from "express";

import { crudFactory } from "../../utils/crudFactory.js";

import { match as formatMatch } from "../../utils/format/match.js";
import { parseObjectId } from "../../csvImport/utils/parseObjectId.js";
import csv from "csv-parser";
import { fromZonedTime } from "date-fns-tz";
import { match } from "@myorg/shared";
import { MatchModel } from "../../models/match.js";
import { DecodedRequest } from "types.js";
import { getNest } from "../../utils/getNest.js";
import { convertObjectIdToString } from "../../utils/convertObjectIdToString.js";
import { match as customMatch } from "utils/customMatchStage/match.js";

const getAllItems = crudFactory(match(MatchModel, customMatch)).getAllItems;
const createItem = crudFactory(match(MatchModel, customMatch)).createItem;
const getItem = crudFactory(match(MatchModel, customMatch)).getItem;
const updateItem = crudFactory(match(MatchModel, customMatch)).updateItem;
const deleteItem = crudFactory(match(MatchModel, customMatch)).deleteItem;

const {
  MONGO_MODEL,
  SCHEMA: { POPULATED },
  TYPE,
  POPULATE_PATHS,
} = match(MatchModel, customMatch);

function parseDateJST(dateStr: string) {
  // CSVの日付フォーマットをパース（例: "1992/9/5 15:00:00"）
  // JSTとして解釈し、UTCに変換したDateを返す
  if (!dateStr) return undefined;
  return fromZonedTime(new Date(dateStr), "Asia/Tokyo");
}

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage: Record<string, any> = {};

//   if (req.query.competition) {
//     try {
//       matchStage.competition = new mongoose.Types.ObjectId(
//         req.query.competition as string
//       );
//     } catch {
//       return res.status(400).json({ erro: "Invalid competition ID" });
//     }
//   }

//   if (req.query.season) {
//     try {
//       matchStage.season = new mongoose.Types.ObjectId(
//         req.query.season as string
//       );
//     } catch {
//       return res.status(400).json({ erro: "Invalid season ID" });
//     }
//   }

//   if (req.query.team) {
//     try {
//       const teamId = new mongoose.Types.ObjectId(req.query.team as string);

//       // すでに $or がある場合も考慮してマージ
//       if (!matchStage.$or) {
//         matchStage.$or = [];
//       }
//       matchStage.$or.push({ home_team: teamId }, { away_team: teamId });
//     } catch {
//       return res.status(400).json({ error: "Invalid team ID" });
//     }
//   }
//   const data = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { competition_stage: 1, date: 1, _id: 1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data: data.map(formatMatch) });
// };

// const createItem = async (req: Request, res: Response) => {
//   const createData = {
//     ...req.body,
//   };

//   const created = await MONGO_MODEL.create(createData);
//   const populated = await MONGO_MODEL.findById(created._id).populate(
//     getNest(true, POPULATE_PATHS)
//   );

//   const parsed = POPULATED.parse(populated);
//   const data = formatMatch ? formatMatch(parsed) : parsed;
//   res.status(StatusCodes.CREATED).json({ message: "追加しました", data });
// };

// const getItem = async (req: Request, res: Response) => {
//   if (!req.params.id) {
//     throw new BadRequestError();
//   }
//   const {
//     params: { id },
//   } = req;
//   const populated = await MONGO_MODEL.findById(id).populate(
//     getNest(true, POPULATE_PATHS)
//   );
//   if (!populated) {
//     throw new NotFoundError();
//   }

//   const parsed = POPULATED.parse(populated);
//   const data = formatMatch ? formatMatch(parsed) : parsed;
//   res.status(StatusCodes.OK).json({ data });
// };

// const updateItem = async (req: Request, res: Response) => {
//   const {
//     params: { id },
//     body,
//   } = req;

//   const updatedData = { ...body };

//   const updated = await MONGO_MODEL.findByIdAndUpdate(
//     { _id: id },
//     updatedData,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   if (!updated) {
//     throw new NotFoundError();
//   }

//   // update
//   const populated = await MONGO_MODEL.findById(updated._id).populate(
//     getNest(true, POPULATE_PATHS)
//   );
//   const parsed = POPULATED.parse(populated);
//   const data = formatMatch ? formatMatch(parsed) : parsed;
//   res.status(StatusCodes.OK).json({ message: "編集しました", data });
// };

// const deleteItem = async (req: Request, res: Response) => {
//   if (!req.params.id) {
//     throw new BadRequestError();
//   }
//   const {
//     params: { id },
//   } = req;

//   const team = await MONGO_MODEL.findOneAndDelete({ _id: id });
//   if (!team) {
//     throw new NotFoundError();
//   }

//   res.status(StatusCodes.OK).json({ message: "削除しました" });
// };

const uploadItem = async (req: DecodedRequest, res: Response) => {
  const rows: (typeof TYPE)[] = [];

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
          return formatMatch ? formatMatch(parsed) : parsed;
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
