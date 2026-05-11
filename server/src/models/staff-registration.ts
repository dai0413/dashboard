import {
  getKey,
  registrationStatus,
  registrationType,
} from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { StaffRegistrationZodSchema } from "@dai0413/myorg-shared";
import z from "zod";

type StaffRegistrationType = z.infer<typeof StaffRegistrationZodSchema>;

export interface IStaffRegistration
  extends
    Omit<
      StaffRegistrationType,
      "_id" | "season" | "competition" | "staff" | "team"
    >,
    Document {
  _id: Types.ObjectId;
  season: Types.ObjectId;
  competition: Types.ObjectId;
  staff: Types.ObjectId;
  team: Types.ObjectId;
}

const StaffRegistrationSchema: Schema<IStaffRegistration> = new Schema<
  IStaffRegistration,
  any,
  IStaffRegistration
>(
  {
    date: { type: Date },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    role: { type: String },
    name: { type: String },
    en_name: { type: String },
    registration_type: { type: String, enum: getKey(registrationType()) },
    registration_status: { type: String, enum: getKey(registrationStatus()) },
    note: { type: String },
  },
  { timestamps: true },
);

StaffRegistrationSchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
    date: 1,
    role: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      date: { $exists: true },
      role: { $exists: true },
    },
  },
);

StaffRegistrationSchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
    date: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      role: { $exists: false },
      date: { $exists: true },
    },
  },
);

StaffRegistrationSchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
    role: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      role: { $exists: true },
      date: { $exists: false },
    },
  },
);

StaffRegistrationSchema.index(
  {
    season: 1,
    staff: 1,
    team: 1,
    registration_type: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      role: { $exists: false },
      date: { $exists: false },
    },
  },
);

async function applyCompetition(updateOrDoc: Partial<IStaffRegistration>) {
  const Season = mongoose.model("Season");
  const season = await Season.findById(updateOrDoc.season);
  if (season) {
    updateOrDoc.competition = season.competition;
  }
}

StaffRegistrationSchema.pre("validate", async function (next) {
  if (this.season) {
    await applyCompetition(this);
  }

  next();
});

StaffRegistrationSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    if (doc.season) {
      await applyCompetition(doc);
    }
  }

  next();
});

StaffRegistrationSchema.pre(
  ["findOneAndUpdate", "updateOne"],
  async function (next) {
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return next();

    // update.$set を吸収
    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<IStaffRegistration>;

    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();

    const merged: Partial<IStaffRegistration> = {
      ...doc.toObject(),
      ...update,
    };

    if (merged.season) {
      await applyCompetition(merged);
      update.competition = merged.competition;
    }

    this.setUpdate(update);
    next();
  },
);

StaffRegistrationSchema.pre("save", async function (next) {
  if (this.registration_type === "register") {
    await StaffRegistrationModel.updateMany(
      {
        season: this.season,
        staff: this.staff,
        _id: { $ne: this._id },
      },
      { registration_status: "terminated" },
    );
    this.registration_status = "active";
  }

  if (this.registration_type === "deregister") {
    const filter: any = {
      season: this.season,
      staff: this.staff,
      _id: { $ne: this._id },
    };

    if (this.date) {
      filter.date = { $lte: this.date };
    }

    await StaffRegistrationModel.updateMany(filter, {
      registration_status: "terminated",
    });

    this.registration_status = "terminated";
  }

  next();
});

export const StaffRegistrationModel: Model<IStaffRegistration> =
  mongoose.model<IStaffRegistration>(
    "StaffRegistration",
    StaffRegistrationSchema,
  );
