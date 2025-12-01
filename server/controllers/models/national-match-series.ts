import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { nationalMatchSeries } from "@dai0413/shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { NationalMatchSeriesModel } from "../../models/national-match-series.js";
const { MONGO_MODEL } = nationalMatchSeries(NationalMatchSeriesModel);

const getAllItems = crudFactory(
  nationalMatchSeries(NationalMatchSeriesModel)
).getAllItems;
const createItem = crudFactory(
  nationalMatchSeries(NationalMatchSeriesModel)
).createItem;
const getItem = crudFactory(
  nationalMatchSeries(NationalMatchSeriesModel)
).getItem;
const updateItem = crudFactory(
  nationalMatchSeries(NationalMatchSeriesModel)
).updateItem;
const deleteItem = crudFactory(
  nationalMatchSeries(NationalMatchSeriesModel)
).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage: Record<string, any> = {};

//   if (req.query.country) {
//     try {
//       matchStage.country = new mongoose.Types.ObjectId(
//         req.query.country as string
//       );
//     } catch {
//       return res.status(400).json({ error: "Invalid country ID" });
//     }
//   }

//   const dat = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { joined_at: -1, _id: -1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data: dat });
// };

// const createItem = async (req: Request, res: Response) => {
//   const nationalMatchSeriesData = {
//     ...req.body,
//   };

//   const nationalMatchSeries = await MONGO_MODEL.create(nationalMatchSeriesData);

//   const pupulatedData = await MONGO_MODEL.findById(
//     nationalMatchSeries._id
//   ).populate(getNest(true, POPULATE_PATHS));

//   res
//     .status(StatusCodes.CREATED)
//     .json({ message: "追加しました", data: pupulatedData });
// };

// const getItem = async (req: Request, res: Response) => {
//   if (!req.params.id) {
//     throw new BadRequestError();
//   }
//   const {
//     params: { id: nationalMatchSeriesId },
//   } = req;
//   const nationalMatchSeries = await MONGO_MODEL.findById(
//     nationalMatchSeriesId
//   ).populate(getNest(true, POPULATE_PATHS));
//   if (!nationalMatchSeries) {
//     throw new NotFoundError();
//   }

//   res.status(StatusCodes.OK).json({
//     data: {
//       ...nationalMatchSeries.toObject(),
//     },
//   });
// };

// const updateItem = async (req: Request, res: Response) => {
//   const {
//     params: { id: nationalMatchSeriesId },
//     body,
//   } = req;

//   const updatedData = { ...body };

//   const updated = await MONGO_MODEL.findByIdAndUpdate(
//     { _id: nationalMatchSeriesId },
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
//   res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
// };

// const deleteItem = async (req: Request, res: Response) => {
//   if (!req.params.id) {
//     throw new BadRequestError();
//   }
//   const {
//     params: { id: nationalMatchSeriesId },
//   } = req;

//   const nationalMatchSeries = await MONGO_MODEL.findOneAndDelete({
//     _id: nationalMatchSeriesId,
//   });
//   if (!nationalMatchSeries) {
//     throw new NotFoundError();
//   }

//   res.status(StatusCodes.OK).json({ message: "削除しました" });
// };

const downloadItems = async (req: Request, res: Response) => {
  try {
    const items = await MONGO_MODEL.find();
    if (items.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"_id","name","abbr","country","age_group","joined_at","left_at","urls"\n`;

    const csvContent = items
      .map((item: any) => {
        return `"${item._id}","${item.name}","${item.abbr}","${item.country}","${item.age_group}","${item.joined_at}","${item.left_at}","${item.urls}"`;
      })
      .join("\n");

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("national-match-series.csv");
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
  getItem,
  updateItem,
  deleteItem,
  downloadItems,
};
