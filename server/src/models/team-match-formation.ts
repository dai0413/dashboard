import { TeamMatchFormationType } from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITeamMatchFormation
  extends
    Omit<TeamMatchFormationType, "_id" | "match" | "team" | "formation">,
    Document {
  _id: Types.ObjectId;
  match: Types.ObjectId;
  team: Types.ObjectId;
  formation: Types.ObjectId;
}

const TeamMatchFormationSchema: Schema<ITeamMatchFormation> = new Schema<
  ITeamMatchFormation,
  any,
  ITeamMatchFormation
>(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    formation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Formation",
      required: true,
    },
  },
  { timestamps: true },
);

TeamMatchFormationSchema.index({ match: 1, team: 1 }, { unique: true });

export const TeamMatchFormationModel: Model<ITeamMatchFormation> =
  mongoose.model<ITeamMatchFormation>(
    "TeamMatchFormation",
    TeamMatchFormationSchema,
  );
