import {
  getKey,
  StaffMatchEventLogType,
  special_time,
  periodLabel,
} from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStaffMatchEventLog
  extends
    Omit<
      StaffMatchEventLogType,
      "_id" | "match" | "team" | "match_event_type" | "staff"
    >,
    Document {
  _id: Types.ObjectId;
  match: Types.ObjectId;
  team: Types.ObjectId;
  match_event_type: Types.ObjectId;
  staff: Types.ObjectId;
}

const StaffMatchEventLogSchema: Schema<IStaffMatchEventLog> = new Schema<
  IStaffMatchEventLog,
  any,
  IStaffMatchEventLog
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
    match_event_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchEventType",
      required: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    staff_name: { type: String },
    time: { type: Number },
    add_time: { type: Number },
    special_time: { type: String, enum: getKey(special_time()) },
    period_label: { type: String, enum: getKey(periodLabel()) },
    time_name: { type: String },
    unique_key: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

function buildUniqueKey(doc: any) {
  return [
    doc.match?.toString(),
    doc.match_event_type?.toString(),
    doc.staff?.toString() ?? doc.staff_name ?? "no-staff",
    doc.time_name ?? "no-time",
  ].join("|");
}

StaffMatchEventLogSchema.pre("validate", function (next) {
  this.unique_key = buildUniqueKey(this);
  next();
});

StaffMatchEventLogSchema.pre(
  "insertMany",
  function (next, docs: IStaffMatchEventLog[]) {
    docs.forEach((doc) => {
      doc.unique_key = buildUniqueKey(doc);
    });
    next();
  },
);

StaffMatchEventLogSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (!update) return;

  // aggregation pipeline update は無視
  if (Array.isArray(update)) return;

  if (!update.$set) {
    update.$set = {};
  }

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const merged = {
    ...doc.toObject(),
    ...update.$set,
  };

  update.$set.unique_key = buildUniqueKey(merged);
});

export const StaffMatchEventLogModel: Model<IStaffMatchEventLog> =
  mongoose.model<IStaffMatchEventLog>(
    "StaffMatchEventLog",
    StaffMatchEventLogSchema,
  );
