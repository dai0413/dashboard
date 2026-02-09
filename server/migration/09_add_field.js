import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import "../dist/models/match.js";
import { SeasonModel } from "../dist/models/season.js";
import { CompetitionModel } from "../dist/models/competition.js";
import { CompetitionStageModel } from "../dist/models/competition-stage.js";
import { TeamModel } from "../dist/models/team.js";
import { PlayerModel } from "../dist/models/player.js";
import { StaffModel } from "../dist/models/staff.js";
import { RefereeModel } from "../dist/models/referee.js";
import { generateNormalizedEnName } from "@dai0413/myorg-shared";

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

async function applyTeamNormalizedName(data) {
  data.normalized_name = data.team.normalize(`NFKC`);
}

const updateField = async () => {
  console.log(`start update`);
  await mongoose.connect(mongoUri);
  const Match = mongoose.model("Match");
  const Team = mongoose.model("Team");
  const Player = mongoose.model("Player");
  const Staff = mongoose.model("Staff");
  const Referee = mongoose.model("Referee");

  // matchモデルにname追加
  const matches = await Match.find({ name: { $exists: false } });
  for (const match of matches) {
    await applyMatchName(match);
    await match.save({ validateBeforeSave: false });
  }
  console.log(`${matches.length} matches updated`);

  // teamモデルにnormalized_name追加
  const teams = await Team.find();
  for (const team of teams) {
    await applyTeamNormalizedName(team);
    await team.save({ validateBeforeSave: false });
  }
  console.log(`${teams.length} teams updated`);

  // player モデルにnormalized_en_name追加
  const players = await Player.find({ en_name: { $exists: true } });
  for (const player of players) {
    const normalized_en_name = generateNormalizedEnName(player.en_name);
    player.normalized_en_name = normalized_en_name;
    await player.save({ validateBeforeSave: false });
  }
  // staff モデルにnormalized_en_name追加
  const staffs = await Staff.find({ en_name: { $exists: true } });
  for (const staff of staffs) {
    const normalized_en_name = generateNormalizedEnName(staff.en_name);
    staff.normalized_en_name = normalized_en_name;
    await staff.save({ validateBeforeSave: false });
  }
  // referee モデルにnormalized_en_name追加
  const referees = await Referee.find({ en_name: { $exists: true } });
  for (const referee of referees) {
    const normalized_en_name = generateNormalizedEnName(referee.en_name);
    referee.normalized_en_name = normalized_en_name;
    await referee.save({ validateBeforeSave: false });
  }

  await mongoose.disconnect();
  process.exit(0);
};

updateField();
