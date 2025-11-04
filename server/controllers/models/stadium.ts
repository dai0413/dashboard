import { stadium } from "../../../shared/models-config/stadium.ts";
import { crudFactory } from "../../utils/crudFactory.ts";

const getAllItems = crudFactory(stadium).getAllItems;
const createItem = crudFactory(stadium).createItem;
const getItem = crudFactory(stadium).getItem;
const updateItem = crudFactory(stadium).updateItem;
const deleteItem = crudFactory(stadium).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage = {};

//   const data = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { _id: 1, order: 1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data });
// };

// const createItem = async (req: Request, res: Response) => {
//   let populatedData;
//   if (bulk && Array.isArray(req.body)) {
//     const docs = await MONGO_MODEL.insertMany(req.body);

//     const ids = docs.map((doc) => doc._id);
//     populatedData = await MONGO_MODEL.find({
//       _id: { $in: ids },
//     }).populate(getNest(true, POPULATE_PATHS));
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

export { getAllItems, createItem, getItem, updateItem, deleteItem };
