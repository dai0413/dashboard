// import mongoose, { Types, Schema, Document, Model, Error } from "mongoose";
// import { NationalCallUpType } from "../../shared/dist/schemas/national-callup.schema.ts";
// import { position_group } from "../../shared/dist/enum/position_group.ts";
// import { status } from "../../shared/dist/enum/status.ts";
// import { left_reason } from "../../shared/dist/enum/left_reason.ts";

// export interface INationalCallUp
//   extends Omit<NationalCallUpType, "_id" | "series" | "player" | "team">,
//     Document {
//   _id: Types.ObjectId;
//   series: Types.ObjectId;
//   player: Types.ObjectId;
//   team: Types.ObjectId;
// }

// const NationalCallUpSchema: Schema<INationalCallUp> = new Schema<
//   INationalCallUp,
//   any,
//   INationalCallUp
// >(
//   {
//     series: {
//       type: Schema.Types.ObjectId,
//       ref: "NationalMatchSeries",
//       required: true,
//     },
//     player: {
//       type: Schema.Types.ObjectId,
//       ref: "Player",
//       required: true,
//     },
//     team: {
//       type: Schema.Types.ObjectId,
//       ref: "Team",
//     },
//     team_name: { type: String },
//     joined_at: { type: Date },
//     left_at: { type: Date },
//     number: { type: Number },
//     position_group: { type: String, enum: position_group },
//     is_captain: { type: Boolean, default: false, required: true },
//     is_overage: { type: Boolean, default: false, required: true },
//     is_backup: { type: Boolean, default: false, required: true },
//     is_training_partner: { type: Boolean, default: false, required: true },
//     is_additional_call: { type: Boolean, default: false, required: true },
//     status: { type: String, enum: status, default: "joined" },
//     left_reason: { type: String, enum: left_reason },
//   },
//   { timestamps: true }
// );

// NationalCallUpSchema.index({ series: 1, player: 1 }, { unique: true });

// async function applySeriesDates(doc: Partial<INationalCallUp>) {
//   const status = doc.status;
//   if (!status) return;

//   if (status === "declined") {
//     // 辞退の場合は期間を空にする
//     doc.joined_at = undefined;
//     doc.left_at = undefined;
//     return;
//   }

//   if (!["joined", "withdrawn"].includes(status)) {
//     return; // その他はスキップ
//   }

//   if (!doc.series) {
//     throw new Error("series is required");
//   }

//   const SeriesModel = mongoose.model("NationalMatchSeries");
//   const seriesDoc = await SeriesModel.findById(doc.series).select(
//     "joined_at left_at"
//   );

//   if (!seriesDoc) {
//     throw new Error(`series document not found: ${doc.series}`);
//   }

//   // joined_at 補完 & 範囲調整
//   if (!doc.joined_at) {
//     doc.joined_at = seriesDoc.joined_at;
//   } else if (seriesDoc.joined_at && doc.joined_at < seriesDoc.joined_at) {
//     doc.joined_at = seriesDoc.joined_at;
//   }

//   // left_at 補完 & 範囲調整
//   if (!doc.left_at) {
//     doc.left_at = seriesDoc.left_at;
//   } else if (seriesDoc.left_at && doc.left_at > seriesDoc.left_at) {
//     doc.left_at = seriesDoc.left_at;
//   }
// }

// NationalCallUpSchema.pre("save", async function (next) {
//   try {
//     await applySeriesDates(this);
//     next();
//   } catch (err) {
//     next(err as Error);
//   }
// });

// NationalCallUpSchema.pre(
//   "insertMany",
//   async function (next, docs: INationalCallUp[]) {
//     try {
//       for (const doc of docs) {
//         await applySeriesDates(doc);
//       }
//       next();
//     } catch (err) {
//       next(err as Error);
//     }
//   }
// );

// export const NationalCallUpModel: Model<INationalCallUp> =
//   mongoose.model<INationalCallUp>("NationalCallUp", NationalCallUpSchema);
