import mongoose, { Types, Schema, Document, Model } from "mongoose";
import {
  getKey,
  FormationType,
  position_formation,
} from "@dai0413/myorg-shared";

export interface IFormation extends Omit<FormationType, "_id">, Document {
  _id: Types.ObjectId;
}

const FormationSchema = new Schema<IFormation, any, IFormation>(
  {
    name: { type: String, required: true, unique: true },
    position_formation: {
      type: [String],
      enum: getKey(position_formation()),
      required: true,
      validate: [
        {
          validator(values: string[]) {
            return Array.isArray(values) && values.length === 11;
          },
          message: "position_formation は 11 個である必要があります",
        },
        {
          validator(values: string[]) {
            return new Set(values).size === values.length;
          },
          message: "position_formation 内の重複は許可されません",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const FormationModel: Model<IFormation> = mongoose.model<IFormation>(
  "Formation",
  FormationSchema
);
