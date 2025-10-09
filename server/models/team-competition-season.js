import { mongoose } from "mongoose";

const TeamCompetitionSeasonSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
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
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

TeamCompetitionSeasonSchema.index(
  {
    team: 1,
    season: 1,
    competition: 1,
  },
  {
    unique: true,
  }
);

TeamCompetitionSeasonSchema.pre("validate", async function (next) {
  if (!this.competition && this.season) {
    const Season = mongoose.model("Season");
    const season = await Season.findById(this.season);
    if (season) {
      this.competition = season.competition;
    }
  }
  next();
});

TeamCompetitionSeasonSchema.pre(
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
    next();
  }
);

export const TeamCompetitionSeason = mongoose.model(
  "TeamCompetitionSeason",
  TeamCompetitionSeasonSchema
);
