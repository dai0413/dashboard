// import { StatusCodes } from "http-status-codes";
// import { Request, Response } from "express";

// import { team } from "../../../shared/dist/models-config/team.js";
// import { crudFactory } from "../../utils/crudFactory.ts";

// const getAllItems = crudFactory(team).getAllItems;
// const createItem = crudFactory(team).createItem;
// const getItem = crudFactory(team).getItem;
// const updateItem = crudFactory(team).updateItem;
// const deleteItem = crudFactory(team).deleteItem;

// const { MONGO_MODEL, TYPE } = team;

// // const getAllItems = async (req: Request, res: Response) => {
// //   const matchStage = {};

// //   const data = await MONGO_MODEL.aggregate([
// //     ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
// //     ...getNest(false, POPULATE_PATHS),
// //     { $sort: { _id: 1, order: 1 } },
// //   ]);

// //   res.status(StatusCodes.OK).json({ data });
// // };

// // const createItem = async (req: Request, res: Response) => {
// //   let populatedData;
// //   if (bulk && Array.isArray(req.body)) {
// //     const docs = await MONGO_MODEL.insertMany(req.body);

// //     const ids = docs.map((doc) => doc._id);
// //     populatedData = await MONGO_MODEL.find({
// //       _id: { $in: ids },
// //     }).populate(getNest(true, POPULATE_PATHS));
// //   } else {
// //     const data = await MONGO_MODEL.create(req.body);
// //     populatedData = await MONGO_MODEL.findById(data._id).populate(
// //       getNest(true, POPULATE_PATHS)
// //     );
// //   }
// //   res
// //     .status(StatusCodes.CREATED)
// //     .json({ message: "追加しました", data: populatedData });
// // };

// // const getItem = async (req: Request, res: Response) => {
// //   if (!req.params.id) {
// //     throw new BadRequestError();
// //   }
// //   const {
// //     params: { id },
// //   } = req;
// //   const data = await MONGO_MODEL.findById(id).populate(
// //     getNest(true, POPULATE_PATHS)
// //   );
// //   if (!data) {
// //     throw new NotFoundError();
// //   }
// //   res.status(StatusCodes.OK).json({ data });
// // };

// // const updateItem = async (req: Request, res: Response) => {
// //   if (!req.params.id) {
// //     throw new BadRequestError();
// //   }
// //   const {
// //     params: { id },
// //   } = req;

// //   const updated = await MONGO_MODEL.findByIdAndUpdate(id, req.body, {
// //     new: true,
// //     runValidators: true,
// //   });
// //   if (!updated) {
// //     throw new NotFoundError();
// //   }

// //   const populated = await MONGO_MODEL.findById(updated._id).populate(
// //     getNest(true, POPULATE_PATHS)
// //   );
// //   res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
// // };

// // const deleteItem = async (req: Request, res: Response) => {
// //   if (!req.params.id) {
// //     throw new BadRequestError();
// //   }
// //   const {
// //     params: { id },
// //   } = req;

// //   const data = await MONGO_MODEL.findOneAndDelete({ _id: id });
// //   if (!data) {
// //     throw new NotFoundError();
// //   }
// //   res.status(StatusCodes.OK).json({ message: "削除しました" });
// // };

// const downloadItem = async (req: Request, res: Response) => {
//   try {
//     const data = await MONGO_MODEL.find();
//     if (data.length === 0) {
//       return res.status(404).json({ message: "データがありません" });
//     }

//     const header = `"id","team","abbr","enTeam","country","genre","jdataid","labalph","transferurl","sofaurl"\n`;

//     const csvContent = data
//       .map((team: any) => {
//         return `"${team._id}","${team.team}","${team.abbr}","${team.enTeam}","${team.country}","${team.genre}","${team.jdataid}","${team.labalph}","${team.transferurl},"${team.sofaurl}""`;
//       })
//       .join("\n");

//     res.header("Content-Type", "text/csv; charset=utf-8");
//     res.attachment("teams.csv");
//     res.status(StatusCodes.OK).send("\uFEFF" + header + csvContent); // 先頭にBOMをつけてExcel文字化け防止
//   } catch (err) {
//     console.error("CSV出力エラー:", err);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: "CSV出力に失敗しました" });
//   }
// };

// export {
//   getAllItems,
//   createItem,
//   getItem,
//   updateItem,
//   deleteItem,
//   downloadItem,
// };
