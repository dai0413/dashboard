import { injury } from "../../../shared/models-config/injury.ts";
import { crudFactory } from "../../utils/crudFactory.ts";

const getAllItems = crudFactory(injury).getAllItems;
const createItem = crudFactory(injury).createItem;
const getItem = crudFactory(injury).getItem;
const updateItem = crudFactory(injury).updateItem;
const deleteItem = crudFactory(injury).deleteItem;

// const getAllItems = async (req: Request, res: Response) => {
//   const matchStage = {};

//   if (req.query.player) {
//     try {
//       matchStage.player = new mongoose.Types.ObjectId(req.query.player);
//     } catch {
//       return res.status(400).json({ error: "Invalid player ID" });
//     }
//   }

//   if (req.query.now_team) {
//     try {
//       matchStage.now_team = new mongoose.Types.ObjectId(req.query.now_team);
//     } catch {
//       return res.status(400).json({ error: "Invalid now_team ID" });
//     }
//   }

//   if (req.query.limit) {
//     try {
//       matchStage.limit = parseInt(req.query.limit, 10);
//     } catch {
//       return res.status(400).json({ error: "Invalid limit" });
//     }
//   }

//   const data = await MONGO_MODEL.aggregate([
//     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
//     ...getNest(false, POPULATE_PATHS),
//     { $sort: { doa: -1, _id: -1 } },
//   ]);

//   res.status(StatusCodes.OK).json({ data: data });
// };

// const createItem = async (req: Request, res: Response) => {
//   const { team, team_name, player } = req.body;
//   let injuryData = { ...req.body };

//   if (!team && !team_name) {
//     throw new BadRequestError("チームを選択または入力してください");
//   }

//   if (!player) {
//     throw new BadRequestError("選手を選択してください");
//   }

//   if (team && team_name)
//     throw new BadRequestError("チームを選択または入力してください");

//   const injury = await MONGO_MODEL.create(injuryData);

//   const populatedInjury = await MONGO_MODEL.findById(injury._id).populate(
//     getNest(true, POPULATE_PATHS)
//   );
//   res
//     .status(StatusCodes.CREATED)
//     .json({ message: "追加しました", data: formatInjury(populatedInjury) });
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
//     data: formatInjury(data),
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

//   const data = await MONGO_MODEL.findOneAndDelete({ _id: id });
//   if (!data) {
//     throw new NotFoundError();
//   }
//   res.status(StatusCodes.OK).json({ message: "削除しました" });
// };

export { getAllItems, createItem, getItem, updateItem, deleteItem };
