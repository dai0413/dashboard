import { ModelType } from "../../../types/models";
import { Competition } from "./model/competition";
import { CompetitionStage } from "./model/competition-stage";
import { Country } from "./model/country";
import { Formation } from "./model/formation";
import { Match } from "./model/match";
import { MatchEventType } from "./model/match-event-type";
import { MatchFormat } from "./model/match-format";
import { NationalCallup } from "./model/national-callup";
import { NationalMatchSeries } from "./model/national-match-series";
import { Player } from "./model/player";
import { Season } from "./model/season";
import { Stadium } from "./model/stadium";
import { Staff } from "./model/staff";
import { Team } from "./model/team";

export type ModelOptionKey = keyof ModelDataOption;

export type ModelDataOption = {
  [ModelType.COMPETITION_STAGE]: CompetitionStage;
  [ModelType.COMPETITION]: Competition;
  [ModelType.COUNTRY]: Country;
  [ModelType.FORMATION]: Formation;
  [ModelType.MATCH_EVENT_TYPE]: MatchEventType;
  [ModelType.MATCH_FORMAT]: MatchFormat;
  [ModelType.MATCH]: Match;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeries;
  [ModelType.NATIONAL_CALLUP]: NationalCallup;
  [ModelType.PLAYER]: Player;
  [ModelType.SEASON]: Season;
  [ModelType.STADIUM]: Stadium;
  [ModelType.STAFF]: Staff;
  [ModelType.TEAM]: Team;
};
