import { ModelType } from "../../../types/models";
import { FormStepsConfig } from "../types";
import { competition } from "../models/competition";
import { competitionStage } from "../models/competition-stage";
import { country } from "../models/country";
import { formation } from "../models/formation";
import { injury } from "../models/injury";
import { match } from "../models/match";
import { matchEventType } from "../models/match-event-type";
import { matchFormat } from "../models/match-format";
import { nationalCallup } from "../models/national-callup";
import { nationalMatchSeries } from "../models/national-match-series";
import { player } from "../models/player";
import { playerAppearance } from "../models/player-appearance";
import { playerMatchEventLog } from "../models/player-match-event-log";
import { playerRegistration } from "../models/player-registration";
import { playerRegistrationHistory } from "../models/player-registration-history";
import { referee } from "../models/referee";
import { refereeAppearance } from "../models/referee-appearance";
import { season } from "../models/season";
import { stadium } from "../models/stadium";
import { staff } from "../models/staff";
import { staffAppearance } from "../models/staff-appearance";
import { staffMatchEventLog } from "../models/staff-match-event-log";
import { staffRegistration } from "../models/staff-registration";
import { staffRegistrationHistory } from "../models/staff-registration-history";
import { statsL } from "../models/stats-l";
import { team } from "../models/team";
import { teamCompetitionSeason } from "../models/team-competition-season";
import { teamMatchFormation } from "../models/team-match-formation";
import { transfer } from "../models/transfer";

export const formStepsMap: Record<ModelType, FormStepsConfig> = {
  [ModelType.COMPETITION]: competition,
  [ModelType.COMPETITION_STAGE]: competitionStage,
  [ModelType.COUNTRY]: country,
  [ModelType.FORMATION]: formation,
  [ModelType.INJURY]: injury,
  [ModelType.MATCH]: match,
  [ModelType.MATCH_EVENT_TYPE]: matchEventType,
  [ModelType.MATCH_FORMAT]: matchFormat,
  [ModelType.NATIONAL_CALLUP]: nationalCallup,
  [ModelType.NATIONAL_MATCH_SERIES]: nationalMatchSeries,
  [ModelType.PLAYER]: player,
  [ModelType.PLAYER_APPEARANCE]: playerAppearance,
  [ModelType.PLAYER_MATCH_EVENT_LOG]: playerMatchEventLog,
  [ModelType.PLAYER_REGISTRATION]: playerRegistration,
  [ModelType.PLAYER_REGISTRATION_HISTORY]: playerRegistrationHistory,
  [ModelType.REFEREE]: referee,
  [ModelType.REFEREE_APPEARANCE]: refereeAppearance,
  [ModelType.SEASON]: season,
  [ModelType.STADIUM]: stadium,
  [ModelType.STAFF]: staff,
  [ModelType.STAFF_APPEARANCE]: staffAppearance,
  [ModelType.STAFF_MATCH_EVENT_LOG]: staffMatchEventLog,
  [ModelType.STAFF_REGISTRATION]: staffRegistration,
  [ModelType.STAFF_REGISTRATION_HISTORY]: staffRegistrationHistory,
  [ModelType.STATS_L]: statsL,
  [ModelType.TEAM]: team,
  [ModelType.TEAM_COMPETITION_SEASON]: teamCompetitionSeason,
  [ModelType.TEAM_MATCH_FORMATION]: teamMatchFormation,
  [ModelType.TRANSFER]: transfer,
};
