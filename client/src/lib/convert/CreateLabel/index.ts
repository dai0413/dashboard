import { ModelType, ModelDataMap } from "../../../types/models";
import { injury } from "./injury";
import { player } from "./player";
import { transfer } from "./transfer";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";
import { nationalCallup } from "./national-callup";
import { referee } from "./referee";
import { competition } from "./competition";
import { season } from "./season";
import { teamCompetitionSeason } from "./team-competition-season";
import { stadium } from "./stadium";
import { competitionStage } from "./competition-stage";
import { matchFormat } from "./match-format";
import { match } from "./match";
import { playerRegistration } from "./player-registration";
import { playerRegistrationHistory } from "./player-registration-history";
import { matchEventType } from "./match-event-type";

type Converter<T extends ModelType> = {
  single: (data: ModelDataMap[T]) => string;
  multiple: (data: ModelDataMap[T][]) => string[];
};

const convertMap: {
  [K in ModelType]: Converter<K>;
} = {
  [ModelType.COMPETITION_STAGE]: {
    single: competitionStage,
    multiple: (data) => data.map(competitionStage),
  },
  [ModelType.COMPETITION]: {
    single: competition,
    multiple: (data) => data.map(competition),
  },
  [ModelType.COUNTRY]: {
    single: country,
    multiple: (data) => data.map(country),
  },
  [ModelType.INJURY]: {
    single: injury,
    multiple: (data) => data.map(injury),
  },
  [ModelType.MATCH_EVENT_TYPE]: {
    single: matchEventType,
    multiple: (data) => data.map(matchEventType),
  },
  [ModelType.MATCH]: {
    single: match,
    multiple: (data) => data.map(match),
  },
  [ModelType.MATCH_FORMAT]: {
    single: matchFormat,
    multiple: (data) => data.map(matchFormat),
  },
  [ModelType.NATIONAL_CALLUP]: {
    single: nationalCallup,
    multiple: (data) => data.map(nationalCallup),
  },
  [ModelType.NATIONAL_MATCH_SERIES]: {
    single: nationalMatchSeries,
    multiple: (data) => data.map(nationalMatchSeries),
  },
  [ModelType.PLAYER_REGISTRATION_HISTORY]: {
    single: playerRegistrationHistory,
    multiple: (data) => data.map(playerRegistrationHistory),
  },
  [ModelType.PLAYER_REGISTRATION]: {
    single: playerRegistration,
    multiple: (data) => data.map(playerRegistration),
  },
  [ModelType.PLAYER]: {
    single: player,
    multiple: (data) => data.map(player),
  },
  [ModelType.REFEREE]: {
    single: referee,
    multiple: (data) => data.map(referee),
  },
  [ModelType.SEASON]: {
    single: season,
    multiple: (data) => data.map(season),
  },
  [ModelType.STADIUM]: {
    single: stadium,
    multiple: (data) => data.map(stadium),
  },
  [ModelType.TEAM_COMPETITION_SEASON]: {
    single: teamCompetitionSeason,
    multiple: (data) => data.map(teamCompetitionSeason),
  },
  [ModelType.TEAM]: {
    single: team,
    multiple: (data) => data.map(team),
  },
  [ModelType.TRANSFER]: {
    single: transfer,
    multiple: (data) => data.map(transfer),
  },
};
export function convert<T extends ModelType>(
  modelType: T,
  data: ModelDataMap[T]
): string;

export function convert<T extends ModelType>(
  modelType: T,
  data: ModelDataMap[T][]
): string[];

// 実装
export function convert<T extends ModelType>(
  modelType: T,
  data: ModelDataMap[T] | ModelDataMap[T][]
): string | string[] {
  const converter = convertMap[modelType];
  return Array.isArray(data)
    ? converter.multiple(data as ModelDataMap[T][])
    : converter.single(data as ModelDataMap[T]);
}
