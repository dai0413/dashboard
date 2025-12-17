import { APP_ROUTES } from "../../lib/appRoutes";
import { Injury, InjuryForm, InjuryGet } from "./injury";
import { Player, PlayerForm, PlayerGet } from "./player";
import { Referee, RefereeForm, RefereeGet } from "./referee";
import { Transfer, TransferForm, TransferGet } from "./transfer";
import { Team, TeamForm, TeamGet } from "./team";
import { Country, CountryForm, CountryGet } from "./country";
import {
  NationalMatchSeries,
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "./national-match-series";
import {
  NationalCallup,
  NationalCallupForm,
  NationalCallupGet,
} from "./national-callup";
import { Competition, CompetitionForm, CompetitionGet } from "./competition";
import { Season, SeasonForm, SeasonGet } from "./season";
import {
  TeamCompetitionSeason,
  TeamCompetitionSeasonForm,
  TeamCompetitionSeasonGet,
} from "./team-competition-season";
import { Stadium, StadiumForm, StadiumGet } from "./stadium";
import {
  CompetitionStage,
  CompetitionStageForm,
  CompetitionStageGet,
} from "./competition-stage";
import { MatchFormat, MatchFormatForm, MatchFormatGet } from "./match-format";
import { Match, MatchForm, MatchGet } from "./match";
import {
  PlayerRegistration,
  PlayerRegistrationForm,
  PlayerRegistrationGet,
} from "./player-registration";
import {
  PlayerRegistrationHistory,
  PlayerRegistrationHistoryForm,
  PlayerRegistrationHistoryGet,
} from "./player-registration-history";
import {
  MatchEventType,
  MatchEventTypeForm,
  MatchEventTypeGet,
} from "./match-event-type";
import { Formation, FormationForm, FormationGet } from "./formation";
import { Staff, StaffForm, StaffGet } from "./staff";

export enum ModelType {
  COMPETITION_STAGE = "competition-stage",
  COMPETITION = "competition",
  COUNTRY = "country",
  INJURY = "injury",
  FORMATION = "formation",
  MATCH_EVENT_TYPE = "match-event-type",
  MATCH_FORMAT = "match-format",
  MATCH = "match",
  NATIONAL_CALLUP = "national-callup",
  NATIONAL_MATCH_SERIES = "national-match-series",
  PLAYER_REGISTRATION_HISTORY = "player-registration-history",
  PLAYER_REGISTRATION = "player-registration",
  PLAYER = "player",
  REFEREE = "referee",
  SEASON = "season",
  STADIUM = "stadium",
  STAFF = "staff",
  TEAM_COMPETITION_SEASON = "team-competition-season",
  TEAM = "team",
  TRANSFER = "transfer",
}

export type ModelDataMap = {
  [ModelType.COMPETITION_STAGE]: CompetitionStage;
  [ModelType.COMPETITION]: Competition;
  [ModelType.COUNTRY]: Country;
  [ModelType.INJURY]: Injury;
  [ModelType.FORMATION]: Formation;
  [ModelType.MATCH_EVENT_TYPE]: MatchEventType;
  [ModelType.MATCH_FORMAT]: MatchFormat;
  [ModelType.MATCH]: Match;
  [ModelType.NATIONAL_CALLUP]: NationalCallup;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeries;
  [ModelType.PLAYER_REGISTRATION_HISTORY]: PlayerRegistrationHistory;
  [ModelType.PLAYER_REGISTRATION]: PlayerRegistration;
  [ModelType.PLAYER]: Player;
  [ModelType.REFEREE]: Referee;
  [ModelType.SEASON]: Season;
  [ModelType.STADIUM]: Stadium;
  [ModelType.STAFF]: Staff;
  [ModelType.TEAM_COMPETITION_SEASON]: TeamCompetitionSeason;
  [ModelType.TEAM]: Team;
  [ModelType.TRANSFER]: Transfer;
};

export type GettedModelDataMap = {
  [ModelType.COMPETITION_STAGE]: CompetitionStageGet;
  [ModelType.COMPETITION]: CompetitionGet;
  [ModelType.COUNTRY]: CountryGet;
  [ModelType.INJURY]: InjuryGet;
  [ModelType.FORMATION]: FormationGet;
  [ModelType.MATCH_EVENT_TYPE]: MatchEventTypeGet;
  [ModelType.MATCH_FORMAT]: MatchFormatGet;
  [ModelType.MATCH]: MatchGet;
  [ModelType.NATIONAL_CALLUP]: NationalCallupGet;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeriesGet;
  [ModelType.PLAYER_REGISTRATION_HISTORY]: PlayerRegistrationHistoryGet;
  [ModelType.PLAYER_REGISTRATION]: PlayerRegistrationGet;
  [ModelType.PLAYER]: PlayerGet;
  [ModelType.REFEREE]: RefereeGet;
  [ModelType.SEASON]: SeasonGet;
  [ModelType.STADIUM]: StadiumGet;
  [ModelType.STAFF]: StaffGet;
  [ModelType.TEAM_COMPETITION_SEASON]: TeamCompetitionSeasonGet;
  [ModelType.TEAM]: TeamGet;
  [ModelType.TRANSFER]: TransferGet;
};

export type FormTypeMap = {
  [ModelType.COMPETITION_STAGE]: CompetitionStageForm;
  [ModelType.COMPETITION]: CompetitionForm;
  [ModelType.COUNTRY]: CountryForm;
  [ModelType.INJURY]: InjuryForm;
  [ModelType.FORMATION]: FormationForm;
  [ModelType.MATCH_EVENT_TYPE]: MatchEventTypeForm;
  [ModelType.MATCH_FORMAT]: MatchFormatForm;
  [ModelType.MATCH]: MatchForm;
  [ModelType.NATIONAL_CALLUP]: NationalCallupForm;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeriesForm;
  [ModelType.PLAYER_REGISTRATION_HISTORY]: PlayerRegistrationHistoryForm;
  [ModelType.PLAYER_REGISTRATION]: PlayerRegistrationForm;
  [ModelType.PLAYER]: PlayerForm;
  [ModelType.REFEREE]: RefereeForm;
  [ModelType.SEASON]: SeasonForm;
  [ModelType.STADIUM]: StadiumForm;
  [ModelType.STAFF]: StaffForm;
  [ModelType.TEAM_COMPETITION_SEASON]: TeamCompetitionSeasonForm;
  [ModelType.TEAM]: TeamForm;
  [ModelType.TRANSFER]: TransferForm;
};

export const ModelRouteMap = {
  [ModelType.COMPETITION_STAGE]: APP_ROUTES.COMPETITION_STAGE,
  [ModelType.COMPETITION]: APP_ROUTES.COMPETITION,
  [ModelType.COUNTRY]: APP_ROUTES.COUNTRY,
  [ModelType.INJURY]: APP_ROUTES.INJURY,
  [ModelType.FORMATION]: APP_ROUTES.FORMATION,
  [ModelType.MATCH_EVENT_TYPE]: APP_ROUTES.MATCH_EVENT_TYPE,
  [ModelType.MATCH_FORMAT]: APP_ROUTES.MATCH_FORMAT,
  [ModelType.MATCH]: APP_ROUTES.MATCH,
  [ModelType.NATIONAL_CALLUP]: APP_ROUTES.NATIONAL_CALLUP,
  [ModelType.NATIONAL_MATCH_SERIES]: APP_ROUTES.NATIONAL_MATCH_SERIES,
  [ModelType.PLAYER_REGISTRATION_HISTORY]:
    APP_ROUTES.PLAYER_REGISTRATION_HISTORY,
  [ModelType.PLAYER_REGISTRATION]: APP_ROUTES.PLAYER_REGISTRATION,
  [ModelType.PLAYER]: APP_ROUTES.PLAYER,
  [ModelType.REFEREE]: APP_ROUTES.REFEREE,
  [ModelType.SEASON]: APP_ROUTES.SEASON,
  [ModelType.STADIUM]: APP_ROUTES.STADIUM,
  [ModelType.STAFF]: APP_ROUTES.STAFF,
  [ModelType.TEAM_COMPETITION_SEASON]: APP_ROUTES.TEAM_COMPETITION_SEASON,
  [ModelType.TEAM]: APP_ROUTES.TEAM,
  [ModelType.TRANSFER]: APP_ROUTES.TRANSFER,
};
