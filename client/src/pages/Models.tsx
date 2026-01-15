import { ModelType } from "../types/models";
import {
  CompetitionStage,
  Competition,
  Country,
  Injury,
  MatchFormat,
  Match,
  Player,
  Referee,
  Season,
  Stadium,
  TeamCompetitionSeason,
  Team,
  Transfer,
  NationalCallup,
  NationalMatchSeries,
  PlayerRegistration,
  PlayerRegistrationHistory,
  MatchEventType,
  Formation,
  Staff,
} from "./ModelTable";
import { JSX } from "react";

const models: Record<ModelType, { table: () => JSX.Element }> = {
  [ModelType.COMPETITION_STAGE]: {
    table: CompetitionStage,
  },
  [ModelType.COMPETITION]: { table: Competition },
  [ModelType.COUNTRY]: { table: Country },
  [ModelType.FORMATION]: { table: Formation },
  [ModelType.INJURY]: { table: Injury },
  [ModelType.MATCH_EVENT_TYPE]: {
    table: MatchEventType,
  },
  [ModelType.MATCH_FORMAT]: { table: MatchFormat },
  [ModelType.MATCH]: { table: Match },
  [ModelType.PLAYER_REGISTRATION_HISTORY]: {
    table: PlayerRegistrationHistory,
  },
  [ModelType.PLAYER_REGISTRATION]: {
    table: PlayerRegistration,
  },
  [ModelType.PLAYER]: { table: Player },
  [ModelType.REFEREE]: { table: Referee },
  [ModelType.SEASON]: { table: Season },
  [ModelType.STADIUM]: { table: Stadium },
  [ModelType.STAFF]: { table: Staff },
  [ModelType.TEAM_COMPETITION_SEASON]: {
    table: TeamCompetitionSeason,
  },
  [ModelType.TEAM]: { table: Team },
  [ModelType.TRANSFER]: { table: Transfer },
  [ModelType.NATIONAL_CALLUP]: {
    table: NationalCallup,
  },
  [ModelType.NATIONAL_MATCH_SERIES]: {
    table: NationalMatchSeries,
  },
};
export default models;
