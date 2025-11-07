import { runControllerTests } from "./utils.ts/runControllerTests.js";
import {
  player,
  country,
  referee,
  team,
  stadium,
  injury,
  nationalMatchSeries,
  nationalCallUp,
  competition,
  season,
  competitionStage,
  matchFormat,
  teamCompetitionSeason,
  match,
  transfer,
} from "@myorg/shared";
import { PlayerModel } from "../models/player.js";
import { TransferModel } from "../models/transfer.js";
import { CountryModel } from "../models/country.js";
import { RefereeModel } from "../models/referee.js";
import { TeamModel } from "../models/team.js";
import { StadiumModel } from "../models/stadium.js";
import { InjuryModel } from "../models/injury.js";
import { NationalMatchSeriesModel } from "../models/national-match-series.js";
import { NationalCallUpModel } from "../models/national-callup.js";
import { CompetitionModel } from "../models/competition.js";
import { SeasonModel } from "../models/season.js";
import { CompetitionStageModel } from "../models/competition-stage.js";
import { MatchFormatModel } from "../models/match-format.js";
import { TeamCompetitionSeasonModel } from "../models/team-competition-season.js";
import { MatchModel } from "../models/match.js";

runControllerTests(player(PlayerModel));
runControllerTests(country(CountryModel));
runControllerTests(referee(RefereeModel));
runControllerTests(team(TeamModel));
runControllerTests(stadium(StadiumModel));
runControllerTests(injury(InjuryModel));
runControllerTests(nationalMatchSeries(NationalMatchSeriesModel));
runControllerTests(nationalCallUp(NationalCallUpModel));
runControllerTests(competition(CompetitionModel));
runControllerTests(season(SeasonModel));
runControllerTests(competitionStage(CompetitionStageModel));
runControllerTests(matchFormat(MatchFormatModel));
runControllerTests(teamCompetitionSeason(TeamCompetitionSeasonModel));
runControllerTests(match(MatchModel));
runControllerTests(transfer(TransferModel));
