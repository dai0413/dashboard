import { StatsLZodSchema } from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import z from "zod";

type StatsLType = z.infer<typeof StatsLZodSchema>;

export interface IStatsL
  extends Omit<StatsLType, "_id" | "match" | "team">, Document {
  _id: Types.ObjectId;
  match: Types.ObjectId;
  team: Types.ObjectId;
}

const nonNegInt = {
  type: Number,
  min: 0,
  validate: {
    validator: Number.isInteger,
    message: "0以上の整数である必要があります",
  },
};

const nonNegNumber = {
  type: Number,
  min: 0,
};

const StatsLSchema: Schema<IStatsL> = new Schema<IStatsL, any, IStatsL>(
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
    // ---- For ----
    xgFor: nonNegNumber,
    shootFor: nonNegInt,
    onTargetFor: nonNegInt,
    pkShootFor: nonNegInt,
    passFor: nonNegInt,
    crossFor: nonNegInt,
    directFkFor: nonNegInt,
    indirectFkFor: nonNegInt,
    cornerKickFor: nonNegInt,
    throwInFor: nonNegInt,
    dribbleFor: nonNegInt,
    tackleFor: nonNegInt,
    clearFor: nonNegInt,
    interceptFor: nonNegInt,
    offsideFor: nonNegInt,
    yellowCardFor: nonNegInt,
    redCardFor: nonNegInt,
    entryAtk3rdFor: nonNegInt,
    entryPenaltyAreaFor: nonNegInt,
    distanceFor: nonNegInt,
    sprintFor: nonNegInt,
    attackCountFor: nonNegInt,

    chanceCreationRateFor: nonNegNumber,
    shootSuccessRateFor: nonNegNumber,
    passSuccessRateFor: nonNegNumber,
    crossSuccessRateFor: nonNegNumber,
    throwInSuccessRateFor: nonNegNumber,
    dribbleSuccessRateFor: nonNegNumber,
    tackleSuccessRateFor: nonNegNumber,

    possession: nonNegNumber,
    acc_time: nonNegNumber,

    // ---- Against ----
    xgAgainst: nonNegNumber,
    shootAgainst: nonNegInt,
    onTargetAgainst: nonNegInt,
    pkShootAgainst: nonNegInt,
    passAgainst: nonNegInt,
    crossAgainst: nonNegInt,
    directFkAgainst: nonNegInt,
    indirectFkAgainst: nonNegInt,
    cornerKickAgainst: nonNegInt,
    throwInAgainst: nonNegInt,
    dribbleAgainst: nonNegInt,
    tackleAgainst: nonNegInt,
    clearAgainst: nonNegInt,
    interceptAgainst: nonNegInt,
    offsideAgainst: nonNegInt,
    yellowCardAgainst: nonNegInt,
    redCardAgainst: nonNegInt,
    entryAtk3rdAgainst: nonNegInt,
    entryPenaltyAreaAgainst: nonNegInt,
    distanceAgainst: nonNegInt,
    sprintAgainst: nonNegInt,
    attackCountAgainst: nonNegInt,

    chanceCreationRateAgainst: nonNegNumber,
    shootSuccessRateAgainst: nonNegNumber,
    passSuccessRateAgainst: nonNegNumber,
    crossSuccessRateAgainst: nonNegNumber,
    throwInSuccessRateAgainst: nonNegNumber,
    dribbleSuccessRateAgainst: nonNegNumber,
    tackleSuccessRateAgainst: nonNegNumber,
  },
  { timestamps: true },
);

StatsLSchema.index({ match: 1, team: 1 }, { unique: true });

export const StatsLModel: Model<IStatsL> = mongoose.model<IStatsL>(
  "StatsL",
  StatsLSchema,
);
