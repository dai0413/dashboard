import { GettedModelDataMap, ModelType } from "../../types/models";
import { transfer } from "./transfer";
import { injury } from "./injury";
import { player } from "./player";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";
import { nationalCallUp } from "./national-callup";
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
import { formation } from "./formation";
import { staff } from "./staff";
import { playerAppearance } from "./player-appearance";
import { staffAppearance } from "./staff-appearance";
import { playerMatchEventLog } from "./player-match-event-log";
import { staffMatchEventLog } from "./staff-match-event-log";
import { teamMatchFormation } from "./team-match-formation";
import { staffRegistrationHistory } from "./staff-registration-history";
import { staffRegistration } from "./staff-registration";
import { statsL } from "./stats-l";
import { refereeAppearance } from "./referee-appearance";
import {
  DetailField,
  isDisplayOnDetail,
  isFilterable,
  isSortable,
  UIFieldDefinition,
} from "../../types/field";
import { FilterField, SortField } from "@dai0413/myorg-shared";
import { cardId } from "../options/fields/cardId";
import {
  CustomOptionMap,
  CustomOptionType,
} from "../../utils/createOption/types/custom";

export const fieldDefinition: {
  [K in ModelType]?: UIFieldDefinition<GettedModelDataMap[K]>[];
} = {
  [ModelType.COMPETITION_STAGE]: competitionStage,
  [ModelType.COMPETITION]: competition,
  [ModelType.COUNTRY]: country,
  [ModelType.FORMATION]: formation,
  [ModelType.INJURY]: injury,
  [ModelType.MATCH_EVENT_TYPE]: matchEventType,
  [ModelType.MATCH_FORMAT]: matchFormat,
  [ModelType.MATCH]: match,
  [ModelType.NATIONAL_CALLUP]: nationalCallUp,
  [ModelType.NATIONAL_MATCH_SERIES]: nationalMatchSeries,
  [ModelType.PLAYER_MATCH_EVENT_LOG]: playerMatchEventLog,
  [ModelType.PLAYER_APPEARANCE]: playerAppearance,
  [ModelType.PLAYER_REGISTRATION_HISTORY]: playerRegistrationHistory,
  [ModelType.PLAYER_REGISTRATION]: playerRegistration,
  [ModelType.PLAYER]: player,
  [ModelType.REFEREE_APPEARANCE]: refereeAppearance,
  [ModelType.REFEREE]: referee,
  [ModelType.SEASON]: season,
  [ModelType.STADIUM]: stadium,
  [ModelType.STAFF_APPEARANCE]: staffAppearance,
  [ModelType.STAFF_MATCH_EVENT_LOG]: staffMatchEventLog,
  [ModelType.STAFF_REGISTRATION_HISTORY]: staffRegistrationHistory,
  [ModelType.STAFF_REGISTRATION]: staffRegistration,
  [ModelType.STAFF]: staff,
  [ModelType.STATS_L]: statsL,
  [ModelType.TEAM_COMPETITION_SEASON]: teamCompetitionSeason,
  [ModelType.TEAM_MATCH_FORMATION]: teamMatchFormation,
  [ModelType.TEAM]: team,
  [ModelType.TRANSFER]: transfer,
};

export const optionFieldDefinition: {
  [K in CustomOptionType]?: UIFieldDefinition<CustomOptionMap[K]>[];
} = {
  [CustomOptionType.CARD_IDS]: cardId,
};

type CombinedKey = ModelType | CustomOptionType;

type FieldValueMap = { [K in ModelType]: GettedModelDataMap[K] } & {
  [K in CustomOptionType]: CustomOptionMap[K];
};

const combinedFieldDefinition: {
  [K in keyof FieldValueMap]?: UIFieldDefinition<FieldValueMap[K]>[];
} = {
  ...fieldDefinition,
  ...optionFieldDefinition,
};

export function getSortableFields<K extends CombinedKey>(
  key: K,
): (UIFieldDefinition<FieldValueMap[K]> & SortField)[] {
  const defs = combinedFieldDefinition[key];
  if (!defs) return [];

  return defs.filter(isSortable);
}

export function getFilterableFields<K extends CombinedKey>(
  key: K,
): (UIFieldDefinition<FieldValueMap[K]> & FilterField)[] {
  const defs = combinedFieldDefinition[key];
  if (!defs) return [];

  return defs.filter(isFilterable);
}

export function getOnDetailFields<K extends ModelType>(
  modelType: K,
): (UIFieldDefinition<GettedModelDataMap[K]> & DetailField)[] {
  const defs = fieldDefinition[modelType];
  if (!defs) return [];

  return defs.filter(isDisplayOnDetail);
}

export function getFields<K extends ModelType>(
  modelType: K,
): UIFieldDefinition<GettedModelDataMap[K]>[] {
  const defs = fieldDefinition[modelType];
  if (!defs) return [];

  return defs;
}
