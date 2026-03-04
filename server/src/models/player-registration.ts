import {
  getKey,
  PlayerRegistrationType,
  registrationStatus,
  positionGroup,
  registrationType,
} from "@dai0413/myorg-shared";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPlayerRegistration
  extends
    Omit<
      PlayerRegistrationType,
      "_id" | "season" | "competition" | "player" | "team"
    >,
    Document {
  _id: Types.ObjectId;
  season: Types.ObjectId;
  competition: Types.ObjectId;
  player: Types.ObjectId;
  team: Types.ObjectId;
}

const PlayerRegistrationSchema: Schema<IPlayerRegistration> = new Schema<
  IPlayerRegistration,
  any,
  IPlayerRegistration
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
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    number: { type: Number },
    position_group: { type: String, enum: getKey(positionGroup()) },
    name: { type: String },
    en_name: { type: String },
    registration_type: { type: String, enum: getKey(registrationType()) },
    height: { type: Number },
    weight: { type: Number },
    homegrown: { type: Boolean },
    registration_status: { type: String, enum: getKey(registrationStatus()) },
    isTypeTwo: { type: Boolean },
    isSpecialDesignation: { type: Boolean },
    note: { type: String },
  },
  { timestamps: true },
);

PlayerRegistrationSchema.index(
  { date: 1, season: 1, player: 1, team: 1, registration_type: 1 },
  { unique: true },
);

PlayerRegistrationSchema.index(
  { season: 1, player: 1, team: 1, registration_type: 1 },
  { unique: true, partialFilterExpression: { date: { $exists: false } } },
);

async function applyCompetition(updateOrDoc: Partial<IPlayerRegistration>) {
  const Season = mongoose.model("Season");
  const season = await Season.findById(updateOrDoc.season);
  if (season) {
    updateOrDoc.competition = season.competition;
  }
}

PlayerRegistrationSchema.pre("validate", async function (next) {
  if (this.season) {
    await applyCompetition(this);
  }

  next();
});

PlayerRegistrationSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    if (doc.season) {
      await applyCompetition(doc);
    }
  }

  next();
});

PlayerRegistrationSchema.pre(
  ["findOneAndUpdate", "updateOne"],
  async function (next) {
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return next();

    // update.$set を吸収
    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<IPlayerRegistration>;

    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();

    const merged: Partial<IPlayerRegistration> = {
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

PlayerRegistrationSchema.pre("save", async function (next) {
  if (this.registration_type === "register") {
    await PlayerRegistrationModel.updateMany(
      {
        season: this.season,
        player: this.player,
        _id: { $ne: this._id },
      },
      { registration_status: "terminated" },
    );
    this.registration_status = "active";
  }

  if (this.registration_type === "deregister") {
    const filter: any = {
      season: this.season,
      player: this.player,
      _id: { $ne: this._id },
    };

    if (this.date) {
      filter.date = { $lte: this.date };
    }

    await PlayerRegistrationModel.updateMany(filter, {
      registration_status: "terminated",
    });

    this.registration_status = "terminated";
  }

  next();
});

export const PlayerRegistrationModel: Model<IPlayerRegistration> =
  mongoose.model<IPlayerRegistration>(
    "PlayerRegistration",
    PlayerRegistrationSchema,
  );
