import { TransferModel } from "../../models/transfer.js";
import { transfer } from "@myorg/shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { transfer as customTransfer } from "../../utils/customMatchStage/transfer.js";

const getAllItems = crudFactory(
  transfer(TransferModel, customTransfer)
).getAllItems;
const createItem = crudFactory(
  transfer(TransferModel, customTransfer)
).createItem;
const getItem = crudFactory(transfer(TransferModel, customTransfer)).getItem;
const updateItem = crudFactory(
  transfer(TransferModel, customTransfer)
).updateItem;
const deleteItem = crudFactory(
  transfer(TransferModel, customTransfer)
).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage = {};

//   // player, team, from_team, to_team, form, fromDateAfter, toDateBefore を matchStage に設定
//   if (req.query.player)
//     matchStage.player = new mongoose.Types.ObjectId(req.query.player);

//   if (req.query.team)
//     matchStage.$or = [
//       { from_team: new mongoose.Types.ObjectId(req.query.team) },
//       { to_team: new mongoose.Types.ObjectId(req.query.team) },
//     ];
//   if (req.query.from_team)
//     matchStage.from_team = new mongoose.Types.ObjectId(req.query.from_team);
//   if (req.query.to_team)
//     matchStage.to_team = new mongoose.Types.ObjectId(req.query.to_team);
//   if (req.query.form) {
//     const isNegated = req.query.form.startsWith("!");
//     const values = (isNegated ? req.query.form.slice(1) : req.query.form).split(
//       ","
//     );
//     matchStage.form = isNegated ? { $nin: values } : { $in: values };
//   }
//   if (req.query.from_date_gte)
//     matchStage.from_date = { $gte: new Date(req.query.from_date_gte) };
//   if (req.query.to_date_before)
//     matchStage.to_date = { $lte: new Date(req.query.to_date_before) };

//   const data = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { doa: -1, _id: -1 } },
//     { $limit: parseInt(req.query.limit, 10) || 30000 },
//   ]);

//   res.status(StatusCodes.OK).json({ data: data.map(formatTransfer) });
// };

// const createItem = async (req: Request, res: Response) => {
//   const { from_team_name, to_team_name, from_team, to_team, player } = req.body;
//   let transferData = { ...req.body };

//   if (!from_team_name && !from_team && !to_team_name && !to_team)
//     throw new BadRequestError("移籍元または移籍先のチームを選択してください");

//   if (from_team && from_team_name)
//     throw new BadRequestError("移籍先チームを選択または入力してください");

//   if (to_team && to_team_name)
//     throw new BadRequestError("移籍先チームを選択または入力してください");

//   const transfer = await MONGO_MODEL.create(transferData);

//   const populatedTransfer = await MONGO_MODEL.findById(transfer._id).populate(
//     getNest(true, POPULATE_PATHS)
//   );

//   if (!populatedTransfer) throw new BadRequestError();

//   const plainTransfer = convertObjectIdToString(populatedTransfer.toObject());
//   const parsed = TransferPopulatedSchema.parse(plainTransfer);

//   const response = TransferResponseSchema.parse(formatTransfer(parsed));

//   res
//     .status(StatusCodes.CREATED)
//     .json({ message: "追加しました", data: response });
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
//     data: formatTransfer(data),
//   });
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

//   if (!populated) {
//     throw new NotFoundError();
//   }

//   res
//     .status(StatusCodes.OK)
//     .json({ message: "編集しました", data: formatTransfer(populated) });
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
