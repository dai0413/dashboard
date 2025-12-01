import { country } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { CountryModel } from "../../models/country.js";

const getAllItems = crudFactory(country(CountryModel)).getAllItems;
const createItem = crudFactory(country(CountryModel)).createItem;
const getItem = crudFactory(country(CountryModel)).getItem;
const updateItem = crudFactory(country(CountryModel)).updateItem;
const deleteItem = crudFactory(country(CountryModel)).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage = {};

//   const dat = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { _id: 1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data: dat });
// };

// const createItem = async (req: Request, res: Response) => {
//   let populated;
//   if (bulk && Array.isArray(req.body)) {
//     const docs = await MONGO_MODEL.insertMany(req.body);

//     const ids = docs.map((doc) => doc._id);
//     populated = await MONGO_MODEL.find({
//       _id: { $in: ids },
//     }).populate(getNest(true, POPULATE_PATHS));
//   } else {
//     const data = await MONGO_MODEL.create(req.body);
//     populated = await MONGO_MODEL.findById(data._id).populate(
//       getNest(true, POPULATE_PATHS)
//     );
//   }

//   if (!populated) throw new BadRequestError();

//   if (Array.isArray(populated)) {
//     // 配列の場合
//     const processed = populated.map((item) => {
//       const plain = convertObjectIdToString(item.toObject());
//       const parsed = POPULATED.parse(plain);
//       return convertFun ? convertFun(parsed) : parsed;
//     });

//     res.status(StatusCodes.CREATED).json({
//       message: "追加しました",
//       data: processed,
//     });
//   } else {
//     const plain = convertObjectIdToString(populated.toObject());
//     const parsed = POPULATED.parse(plain);
//     const response = convertFun ? convertFun(parsed) : parsed;

//     res.status(StatusCodes.CREATED).json({
//       message: "追加しました",
//       data: response,
//     });
//   }
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
