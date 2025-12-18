import csv from "csv-parser";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { teamCompetitionSeason } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { TeamCompetitionSeasonModel } from "../../models/team-competition-season.js";
import { DecodedRequest } from "types.js";
import { parseObjectId } from "../../csvImport/utils/parseObjectId.js";
import { getNest } from "../../utils/getNest.js";
import { convertObjectIdToString } from "../../utils/convertObjectIdToString.js";

const {
  MONGO_MODEL,
  SCHEMA: { POPULATED },
  TYPE,
  POPULATE_PATHS,
} = teamCompetitionSeason(TeamCompetitionSeasonModel);

const getAllItems = crudFactory(
  teamCompetitionSeason(TeamCompetitionSeasonModel)
).getAllItems;
const createItem = crudFactory(
  teamCompetitionSeason(TeamCompetitionSeasonModel)
).createItem;
const getItem = crudFactory(
  teamCompetitionSeason(TeamCompetitionSeasonModel)
).getItem;
const updateItem = crudFactory(
  teamCompetitionSeason(TeamCompetitionSeasonModel)
).updateItem;
const deleteItem = crudFactory(
  teamCompetitionSeason(TeamCompetitionSeasonModel)
).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage: Record<string, any> = {};
//   const populatedAfterMatchStage: Record<string, any> = {};

//   if (req.query.team) {
//     try {
//       matchStage.team = new mongoose.Types.ObjectId(req.query.team as string);
//     } catch {
//       return res.status(400).json({ error: "Invalid team ID" });
//     }
//   }

//   if (req.query.competition) {
//     try {
//       matchStage.competition = new mongoose.Types.ObjectId(
//         req.query.competition as string
//       );
//     } catch {
//       return res.status(400).json({ error: "Invalid competition ID" });
//     }
//   }

//   if (req.query.season) {
//     try {
//       matchStage.season = new mongoose.Types.ObjectId(
//         req.query.season as string
//       );
//     } catch {
//       return res.status(400).json({ error: "Invalid season ID" });
//     }
//   }

//   if (req.query.competition_category) {
//     populatedAfterMatchStage["competition.category"] =
//       req.query.competition_category;
//   }

//   const data = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     ...(Object.keys(populatedAfterMatchStage).length > 0
//       ? [{ $match: populatedAfterMatchStage }]
//       : []),
//     { $sort: { "season.start_date": -1, _id: -1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data });
// };

// const createItem = async (req: Request, res: Response) => {
//   let populatedData;
//   if (bulk && Array.isArray(req.body)) {
//     const docs = await MONGO_MODEL.insertMany(req.body);

//     const ids = docs.map((doc) => doc._id);
//     populatedData = await MONGO_MODEL.find({ _id: { $in: ids } }).populate(
//       getNest(true, POPULATE_PATHS)
//     );
//   } else {
//     const data = await MONGO_MODEL.create(req.body);
//     populatedData = await MONGO_MODEL.findById(data._id).populate(
//       getNest(true, POPULATE_PATHS)
//     );
//   }
//   res
//     .status(StatusCodes.OK)
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
