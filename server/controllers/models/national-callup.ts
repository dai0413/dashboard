// import { nationalCallUp } from "../../../shared/dist/models-config/national-callup.js";
// import { crudFactory } from "../../utils/crudFactory.ts";

// const getAllItems = crudFactory(nationalCallUp).getAllItems;
// const createItem = crudFactory(nationalCallUp).createItem;
// const getItem = crudFactory(nationalCallUp).getItem;
// const updateItem = crudFactory(nationalCallUp).updateItem;
// const deleteItem = crudFactory(nationalCallUp).deleteItem;

// // const getAllItems = async (req: Request, res: Response) => {
// //   const series = req.query.series
// //     ? new mongoose.Types.ObjectId(req.query.series as string)
// //     : null;
// //   const country = req.query.country
// //     ? new mongoose.Types.ObjectId(req.query.country as string)
// //     : null;

// //   const matchStage: Record<string, any> = {};

// //   if (req.query.player)
// //     matchStage.player = new mongoose.Types.ObjectId(req.query.player as string);

// //   const nationalMatchSeries = await MONGO_MODEL.aggregate([
// //     addPositionGroupOrder,
// //     ...(series ? [{ $match: { series } }] : []),
// //     {
// //       $lookup: {
// //         from: "nationalmatchseries",
// //         localField: "series",
// //         foreignField: "_id",
// //         as: "series",
// //       },
// //     },
// //     { $unwind: "$series" },
// //     ...(country ? [{ $match: { "series.country": country } }] : []),
// //     ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
// //     {
// //       $lookup: {
// //         from: "players",
// //         localField: "player",
// //         foreignField: "_id",
// //         as: "player",
// //       },
// //     },
// //     { $unwind: { path: "$player", preserveNullAndEmptyArrays: true } },
// //     {
// //       $lookup: {
// //         from: "teams",
// //         localField: "team",
// //         foreignField: "_id",
// //         as: "team",
// //       },
// //     },
// //     { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
// //     {
// //       $sort: {
// //         series: -1,
// //         position_group_order: 1,
// //         number: 1,
// //         _id: -1,
// //       },
// //     },
// //     { $project: { position_group_order: 0 } },
// //   ]);

// //   const result = nationalMatchSeries.map(formatNationalCallup);
// //   res.status(StatusCodes.OK).json({ data: result });
// // };

// // const createItem = async (req: Request, res: Response) => {
// //   let populatedData;
// //   if (bulk && Array.isArray(req.body)) {
// //     const docs = await MONGO_MODEL.insertMany(req.body);

// //     const ids = docs.map((doc) => doc._id);
// //     populatedData = await MONGO_MODEL.find({ _id: { $in: ids } }).populate(
// //       getNest(true, POPULATE_PATHS)
// //     );
// //   } else {
// //     const data = await MONGO_MODEL.create(req.body);
// //     populatedData = await MONGO_MODEL.findById(data._id).populate(
// //       getNest(true, POPULATE_PATHS)
// //     );
// //   }
// //   res
// //     .status(StatusCodes.OK)
// //     .json({ message: "追加しました", data: populatedData });
// // };

// // const getItem = async (req: Request, res: Response) => {
// //   if (!req.params.id) {
// //     throw new BadRequestError();
// //   }
// //   const {
// //     params: { id: nationalMatchSeriesId },
// //   } = req;
// //   const nationalMatchSeries = await MONGO_MODEL.findById(
// //     nationalMatchSeriesId
// //   ).populate(getNest(true, POPULATE_PATHS));
// //   if (!nationalMatchSeries) {
// //     throw new NotFoundError();
// //   }

// //   res.status(StatusCodes.OK).json({
// //     data: formatNationalCallup(nationalMatchSeries),
// //   });
// // };

// // const updateItem = async (req: Request, res: Response) => {
// //   const {
// //     params: { id: nationalMatchSeriesId },
// //     body,
// //   } = req;

// //   const updatedData = { ...body };

// //   const updated = await MONGO_MODEL.findByIdAndUpdate(
// //     { _id: nationalMatchSeriesId },
// //     updatedData,
// //     {
// //       new: true,
// //       runValidators: true,
// //     }
// //   );
// //   if (!updated) {
// //     throw new NotFoundError();
// //   }

// //   // update
// //   const populated = await MONGO_MODEL.findById(updated._id).populate(
// //     getNest(true, POPULATE_PATHS)
// //   );
// //   res
// //     .status(StatusCodes.OK)
// //     .json({ message: "編集しました", data: formatNationalCallup(populated) });
// // };

// // const deleteItem = async (req: Request, res: Response) => {
// //   if (!req.params.id) {
// //     throw new BadRequestError();
// //   }
// //   const {
// //     params: { id: nationalMatchSeriesId },
// //   } = req;

// //   const nationalMatchSeries = await MONGO_MODEL.findOneAndDelete({
// //     _id: nationalMatchSeriesId,
// //   });
// //   if (!nationalMatchSeries) {
// //     throw new NotFoundError();
// //   }

// //   res.status(StatusCodes.OK).json({ message: "削除しました" });
// // };

// export { getAllItems, createItem, getItem, updateItem, deleteItem };
