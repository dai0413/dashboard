import mongoose, { Schema, Document, Model } from "mongoose";
import { TeamCompetitionSeasonType } from "../../shared/schemas/team-competition-season.schema.ts";

export interface ITeamCompetitionSeasonType
  extends Omit<TeamCompetitionSeasonType, "team" | "season" | "competition">,
    Document {
  team: Schema.Types.ObjectId;
  season: Schema.Types.ObjectId;
  competition: Schema.Types.ObjectId;
}

const TeamCompetitionSeasonSchema: Schema<ITeamCompetitionSeasonType> =
  new Schema<ITeamCompetitionSeasonType, any, ITeamCompetitionSeasonType>(
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
    { timestamps: true }
  );

TeamCompetitionSeasonSchema.index(
  { team: 1, season: 1, competition: 1 },
  { unique: true }
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
    const rawUpdate = this.getUpdate();
    if (!rawUpdate) return;

    // update.$set を吸収
    const update = {
      ...(rawUpdate as any),
      ...(rawUpdate as any).$set,
    } as Partial<ITeamCompetitionSeasonType>;

    const seasonId = update.season;
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

export const TeamCompetitionSeasonModel: Model<ITeamCompetitionSeasonType> =
  mongoose.model<ITeamCompetitionSeasonType>(
    "TeamCompetitionSeason",
    TeamCompetitionSeasonSchema
  );
