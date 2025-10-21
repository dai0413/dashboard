import { matchFormat } from "../../../shared/models-config/match-format.ts";
import { crudFactory } from "../../utils/crudFactory.ts";

const getAllItems = crudFactory(matchFormat).getAllItems;
const createItem = crudFactory(matchFormat).createItem;
const getItem = crudFactory(matchFormat).getItem;
const updateItem = crudFactory(matchFormat).updateItem;
const deleteItem = crudFactory(matchFormat).deleteItem;

const { MONGO_MODEL, POPULATE_PATHS, bulk } = matchFormat;

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
