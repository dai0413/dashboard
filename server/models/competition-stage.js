const mongoose = require("mongoose");

const CompetitionStageSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    stage_type: {
      type: String,
      enum: [
        `none`,
        `1st`,
        `2nd`,
        `group_stage`,
        `round`,
        `quarter_final`,
        `semi_final`,
        `final`,
        `playoff`,
        `qualifier`,
        `other`,
      ],
      default: "none",
      required: true,
    },
    name: {
      type: String,
    },
    round_number: {
      type: Number,
    },
    leg: {
      type: Number,
    },
    order: {
      type: Number,
    },
    parent_stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompetitionStage",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

CompetitionStageSchema.index(
  {
    competition: 1,
    season: 1,
    stage_type: 1,
    round_number: 1,
    leg: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      round_number: { $exists: true },
      leg: { $exists: true },
    },
  }
);

CompetitionStageSchema.index(
  {
    competition: 1,
    season: 1,
    parent_stage: 1,
    order: 1,
  },
  { unique: true }
);

CompetitionStageSchema.index({ competition: 1, season: 1 });

CompetitionStageSchema.pre("save", async function (next) {
  // parent_stage制約

  if (this.parent_stage) {
    const parent = await mongoose
      .model("CompetitionStage")
      .findById(this.parent_stage);
    if (!parent) {
      return next(new Error("Parent stage not found"));
    }
    if (
      !parent.competition.equals(this.competition) ||
      !parent.season.equals(this.season)
    ) {
      return next(
        new Error("Parent stage must belong to the same competition and season")
      );
    }
  }

  next();
});

CompetitionStageSchema.pre("validate", async function (next) {
  // 更新時　seasonの変更,  stage_type === "none"への変更

  if (!this.competition && this.season) {
    const Season = mongoose.model("Season");
    const season = await Season.findById(this.season);
    if (season) {
      this.competition = season.competition;
    }
  }

  if (this.stage_type === "none") {
    this.name = undefined;
    this.round_number = undefined;
    this.leg = undefined;
    this.order = undefined;
  }
  next();
});

CompetitionStageSchema.pre(
  ["findOneAndUpdate", "updateOne"],
  async function (next) {
    const update = this.getUpdate();
    const seasonId = update.season || update.$set?.season;
    if (seasonId) {
      const Season = mongoose.model("Season");
      const season = await Season.findById(seasonId);
      if (season) {
        this.set({ competition: season.competition });
      }
    }

    const stageType = update.stage_type || update.$set?.stage_type;
    if (stageType === "none") {
      if (update.$set) {
        update.$set.name = undefined;
        update.$set.round_number = undefined;
        update.$set.leg = undefined;
        update.$set.order = undefined;
      } else {
        update.name = undefined;
        update.round_number = undefined;
        update.leg = undefined;
        update.order = undefined;
      }
      this.setUpdate(update);
    }

    next();
  }
);

module.exports = mongoose.model("CompetitionStage", CompetitionStageSchema);
