import { RefereeAppearanceZodSchema } from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import z from "zod";

type RefereeAppearanceType = z.infer<typeof RefereeAppearanceZodSchema>;

export interface IRefereeAppearance
  extends Omit<RefereeAppearanceType, "_id" | "match" | "referee">, Document {
  _id: Types.ObjectId;
  match: Types.ObjectId;
  referee: Types.ObjectId;
}

const RefereeAppearanceSchema: Schema<IRefereeAppearance> = new Schema<
  IRefereeAppearance,
  any,
  IRefereeAppearance
>(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referee",
    },
    referee_name: { type: String },
    role: { type: String },
  },
  { timestamps: true },
);

RefereeAppearanceSchema.index(
  { match: 1, referee: 1 },
  {
    unique: true,
    partialFilterExpression: {
      referee: { $type: "objectId" },
    },
  },
);
RefereeAppearanceSchema.index(
  { match: 1, referee_name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      referee_name: { $type: "string" },
    },
  },
);

export const RefereeAppearanceModel: Model<IRefereeAppearance> =
  mongoose.model<IRefereeAppearance>(
    "RefereeAppearance",
    RefereeAppearanceSchema,
  );
