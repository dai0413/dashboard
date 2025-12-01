import { competitionStage } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { CompetitionStageModel } from "../../models/competition-stage.js";

const getAllItems = crudFactory(
  competitionStage(CompetitionStageModel)
).getAllItems;
const createItem = crudFactory(
  competitionStage(CompetitionStageModel)
).createItem;
const getItem = crudFactory(competitionStage(CompetitionStageModel)).getItem;
const updateItem = crudFactory(
  competitionStage(CompetitionStageModel)
).updateItem;
const deleteItem = crudFactory(
  competitionStage(CompetitionStageModel)
).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage: Record<string, any> = {};

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

//   const dat = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { order: 1, _id: 1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data: dat });
// };

// const createItem = async (req: Request, res: Response) => {
//   let populatedData;
//   if (Array.isArray(req.body)) {
//     if (!bulk)
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//         message: "modelsConfigへの設定不足",
//       });

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

//   res.status(StatusCodes.OK).json({
//     data: {
//       ...data.toObject(),
//     },
//   });
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
//   res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
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

export { getAllItems, createItem, getItem, updateItem, deleteItem };
