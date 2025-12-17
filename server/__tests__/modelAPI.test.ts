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
  playerRegistration,
  playerRegistrationHistory,
  matchEventType,
  formation,
  staff,
} from "@dai0413/myorg-shared";
import { runControllerTests } from "../dist/test-utils/runControllerTests.js";

import { PlayerModel } from "../dist/models/player.js";
import { TransferModel } from "../dist/models/transfer.js";
import { CountryModel } from "../dist/models/country.js";
import { RefereeModel } from "../dist/models/referee.js";
import { TeamModel } from "../dist/models/team.js";
import { StadiumModel } from "../dist/models/stadium.js";
import { InjuryModel } from "../dist/models/injury.js";
import { NationalMatchSeriesModel } from "../dist/models/national-match-series.js";
import { NationalCallUpModel } from "../dist/models/national-callup.js";
import { CompetitionModel } from "../dist/models/competition.js";
import { SeasonModel } from "../dist/models/season.js";
import { CompetitionStageModel } from "../dist/models/competition-stage.js";
import { MatchFormatModel } from "../dist/models/match-format.js";
import { TeamCompetitionSeasonModel } from "../dist/models/team-competition-season.js";
import { MatchModel } from "../dist/models/match.js";
import { PlayerRegistrationModel } from "../dist/models/player-registration.js";
import { PlayerRegistrationHistoryModel } from "../dist/models/player-registration-history.js";
import { MatchEventTypeModel } from "../dist/models/match-event-type.js";
import { FormationModel } from "../dist/models/formation.js";
import { StaffModel } from "../dist/models/staff.js";
import { match as customMatch } from "../dist/utils/customMatchStage/match.js";
import { transfer as customTransfer } from "../dist/utils/customMatchStage/transfer.js";

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
runControllerTests(match(MatchModel, customMatch));
runControllerTests(transfer(TransferModel, customTransfer));
runControllerTests(playerRegistration(PlayerRegistrationModel));
runControllerTests(playerRegistrationHistory(PlayerRegistrationHistoryModel));
runControllerTests(matchEventType(MatchEventTypeModel));
runControllerTests(formation(FormationModel));
runControllerTests(staff(StaffModel));
