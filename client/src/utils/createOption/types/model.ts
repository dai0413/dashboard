import { ModelType } from "../../../types/models";
import { CompetitionOption } from "./model/competition";
import { CompetitionStageOption } from "./model/competition-stage";
import { CountryOption } from "./model/country";
import { FormationOption } from "./model/formation";
import { MatchOption } from "./model/match";
import { MatchEventTypeOption } from "./model/match-event-type";
import { MatchFormatOption } from "./model/match-format";
import { NationalCallupOption } from "./model/national-callup";
import { NationalMatchSeriesOption } from "./model/national-match-series";
import { PlayerOption } from "./model/player";
import { SeasonOption } from "./model/season";
import { StadiumOption } from "./model/stadium";
import { StaffOption } from "./model/staff";
import { TeamOption } from "./model/team";
import { TeamCompetitionSeasonOption } from "./model/team-competition-season";
import { TransferOption } from "./model/transfer";

export type ModelOptionKey = keyof ModelDataOption;

export type ModelDataOption = {
  [ModelType.COMPETITION_STAGE]: CompetitionStageOption;
  [ModelType.COMPETITION]: CompetitionOption;
  [ModelType.COUNTRY]: CountryOption;
  [ModelType.FORMATION]: FormationOption;
  [ModelType.MATCH_EVENT_TYPE]: MatchEventTypeOption;
  [ModelType.MATCH_FORMAT]: MatchFormatOption;
  [ModelType.MATCH]: MatchOption;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeriesOption;
  [ModelType.NATIONAL_CALLUP]: NationalCallupOption;
  [ModelType.PLAYER]: PlayerOption;
  [ModelType.SEASON]: SeasonOption;
  [ModelType.STADIUM]: StadiumOption;
  [ModelType.STAFF]: StaffOption;
  [ModelType.TEAM]: TeamOption;
  [ModelType.TRANSFER]: TransferOption;
  [ModelType.TEAM_COMPETITION_SEASON]: TeamCompetitionSeasonOption;
};
