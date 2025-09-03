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

export enum ModelType {
  COMPETITION = "competition",
  COUNTRY = "country",
  INJURY = "injury",
  NATIONAL_CALLUP = "national-callup",
  NATIONAL_MATCH_SERIES = "national-match-series",
  PLAYER = "player",
  REFEREE = "referee",
  SEASON = "season",
  TEAM_COMPETITION_SEASON = "team-competition-season",
  TEAM = "team",
  TRANSFER = "transfer",
}

export type ModelDataMap = {
  [ModelType.COMPETITION]: Competition;
  [ModelType.COUNTRY]: Country;
  [ModelType.INJURY]: Injury;
  [ModelType.NATIONAL_CALLUP]: NationalCallup;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeries;
  [ModelType.PLAYER]: Player;
  [ModelType.REFEREE]: Referee;
  [ModelType.SEASON]: Season;
  [ModelType.TEAM_COMPETITION_SEASON]: TeamCompetitionSeason;
  [ModelType.TEAM]: Team;
  [ModelType.TRANSFER]: Transfer;
};

export type GettedModelDataMap = {
  [ModelType.COMPETITION]: CompetitionGet;
  [ModelType.COUNTRY]: CountryGet;
  [ModelType.INJURY]: InjuryGet;
  [ModelType.NATIONAL_CALLUP]: NationalCallupGet;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeriesGet;
  [ModelType.PLAYER]: PlayerGet;
  [ModelType.REFEREE]: RefereeGet;
  [ModelType.SEASON]: SeasonGet;
  [ModelType.TEAM_COMPETITION_SEASON]: TeamCompetitionSeasonGet;
  [ModelType.TEAM]: TeamGet;
  [ModelType.TRANSFER]: TransferGet;
};

export type FormTypeMap = {
  [ModelType.COMPETITION]: CompetitionForm;
  [ModelType.COUNTRY]: CountryForm;
  [ModelType.INJURY]: InjuryForm;
  [ModelType.NATIONAL_CALLUP]: NationalCallupForm;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeriesForm;
  [ModelType.PLAYER]: PlayerForm;
  [ModelType.REFEREE]: RefereeForm;
  [ModelType.SEASON]: SeasonForm;
  [ModelType.TEAM_COMPETITION_SEASON]: TeamCompetitionSeasonForm;
  [ModelType.TEAM]: TeamForm;
  [ModelType.TRANSFER]: TransferForm;
};

export const ModelRouteMap = {
  [ModelType.COMPETITION]: APP_ROUTES.COMPETITION,
  [ModelType.COUNTRY]: APP_ROUTES.COUNTRY,
  [ModelType.INJURY]: APP_ROUTES.INJURY,
  [ModelType.NATIONAL_CALLUP]: APP_ROUTES.NATIONAL_CALLUP,
  [ModelType.NATIONAL_MATCH_SERIES]: APP_ROUTES.NATIONAL_MATCH_SERIES,
  [ModelType.PLAYER]: APP_ROUTES.PLAYER,
  [ModelType.REFEREE]: APP_ROUTES.REFEREE,
  [ModelType.SEASON]: APP_ROUTES.SEASON,
  [ModelType.TEAM_COMPETITION_SEASON]: APP_ROUTES.TEAM_COMPETITION_SEASON,
  [ModelType.TEAM]: APP_ROUTES.TEAM,
  [ModelType.TRANSFER]: APP_ROUTES.TRANSFER,
};
