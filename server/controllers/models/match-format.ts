import { matchFormat } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { MatchFormatModel } from "../../models/match-format.js";

const getAllItems = crudFactory(matchFormat(MatchFormatModel)).getAllItems;
const createItem = crudFactory(matchFormat(MatchFormatModel)).createItem;
const getItem = crudFactory(matchFormat(MatchFormatModel)).getItem;
const updateItem = crudFactory(matchFormat(MatchFormatModel)).updateItem;
const deleteItem = crudFactory(matchFormat(MatchFormatModel)).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage = {};

//   const dat = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { _id: 1, order: 1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data: dat });
// };

// const createItem = async (req: Request, res: Response) => {
//   const createData = {
//     ...req.body,
//   };

//   const data = await MONGO_MODEL.create(createData);
//   const populatedData = await MONGO_MODEL.findById(data._id).populate(
//     getNest(true, POPULATE_PATHS)
//   );
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
