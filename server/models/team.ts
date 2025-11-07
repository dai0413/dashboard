// import mongoose, { Types, Schema, Document, Model } from "mongoose";
// import { TeamType } from "../../shared/dist/schemas/team.schema.ts";
// import { age_group } from "../../shared/dist/enum/age_group.ts";
// import { division } from "../../shared/dist/enum/division.ts";
// import { genre } from "../../shared/dist/enum/genre.ts";

// export interface ITeam extends Omit<TeamType, "_id" | "country">, Document {
//   _id: Types.ObjectId;
//   country: Types.ObjectId;
// }

// const TeamSchema: Schema<ITeam> = new Schema<ITeam, any, ITeam>(
//   {
//     team: { type: String, required: true },
//     abbr: { type: String },
//     enTeam: { type: String },
//     country: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Country",
//     },
//     genre: { type: String, enum: genre },
//     age_group: { type: String, enum: age_group },
//     division: { type: String, enum: division, default: "1st" },
//     jdataid: { type: Number },
//     labalph: { type: String },
//     transferurl: { type: String },
//     sofaurl: { type: String },
//   },
//   { timestamps: true }
// );

// TeamSchema.index(
//   { team: 1, country: 1 },
//   {
//     unique: true,
//     partialFilterExpression: { country: { $exists: true, $type: "objectId" } },
//   }
// );

// // transferurl が存在する場合のみユニーク
// TeamSchema.index(
//   { transferurl: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       transferurl: { $exists: true, $ne: null, $type: "string" },
//     },
//   }
// );

// // sofaurl が存在する場合のみユニーク
// TeamSchema.index(
//   { sofaurl: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       sofaurl: { $exists: true, $ne: null, $type: "string" },
//     },
//   }
// );

// export const TeamModel: Model<ITeam> = mongoose.model<ITeam>(
//   "Team",
//   TeamSchema
// );
