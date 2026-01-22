import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import "../dist/models/match.js";
import { SeasonModel } from "../dist/models/season.js";
import { CompetitionModel } from "../dist/models/competition.js";
import { CompetitionStageModel } from "../dist/models/competition-stage.js";
import { TeamModel } from "../dist/models/team.js";

const mongoUri = process.env.MONGODB_URI;

async function applyMatchName(match) {
  if (
    !match.season ||
    !match.competition ||
    !match.competition_stage ||
    !match.home_team ||
    !match.away_team
  ) {
    return;
  }

  await mongoose.connect(mongoUri);
  const SeasonModel = mongoose.model("Season");
  const CompetitionModel = mongoose.model("Competition");
  const CompetitionStageModel = mongoose.model("CompetitionStage");
  const TeamModel = mongoose.model("Team");

  const season = await SeasonModel.findById(match.season);
  const competition = await CompetitionModel.findById(match.competition);
  const stage = await CompetitionStageModel.findById(match.competition_stage);
  const home = await TeamModel.findById(match.home_team);
  const away = await TeamModel.findById(match.away_team);

  if (!season || !competition || !stage || !home || !away) return;

  match.name = `${season.name} ${competition.abbr ?? competition.name} ${
    stage.name ? stage.name : ""
  } ${
    match.match_week ? `第${match.match_week}節 ` : ""
  }${home.abbr ?? home.name} vs ${away.abbr ?? away.name}`;
}

const updateField = async () => {
  console.log(`start update`);
  await mongoose.connect(mongoUri);
  const Match = mongoose.model("Match");

  const matches = await Match.find();

  for (const match of matches) {
    await applyMatchName(match);
    await match.save({ validateBeforeSave: false });
  }

  console.log(`${matches.length} matches updated`);

  await mongoose.disconnect();
  process.exit(0);
};

updateField();
