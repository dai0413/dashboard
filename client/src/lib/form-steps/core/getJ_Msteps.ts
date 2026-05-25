import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { match } from "../models/match/forms/j_m";
import { playerAppearance } from "../models/player-appearance/forms/j_m";
import { playerMatchEventLog } from "../models/player-match-event-log/forms/j_m";
import { staffAppearance } from "../models/staff-appearance/forms/j_m";
import { refereeAppearance } from "../models/referee-appearance/forms/j_m";
import { teamMatchFormation } from "../models/team-match-formation/forms/j_m";

type Steps = {
  [ModelType.MATCH]: FormStep<ModelType.MATCH>[];
  [ModelType.PLAYER_APPEARANCE]: FormStep<ModelType.PLAYER_APPEARANCE>[];
  [ModelType.PLAYER_MATCH_EVENT_LOG]: FormStep<ModelType.PLAYER_MATCH_EVENT_LOG>[];
  [ModelType.STAFF_APPEARANCE]: FormStep<ModelType.STAFF_APPEARANCE>[];
  [ModelType.REFEREE_APPEARANCE]: FormStep<ModelType.REFEREE_APPEARANCE>[];
  [ModelType.TEAM_MATCH_FORMATION]: FormStep<ModelType.TEAM_MATCH_FORMATION>[];
};

const steps: Steps = {
  [ModelType.MATCH]: match,
  [ModelType.PLAYER_APPEARANCE]: playerAppearance,
  [ModelType.PLAYER_MATCH_EVENT_LOG]: playerMatchEventLog,
  [ModelType.STAFF_APPEARANCE]: staffAppearance,
  [ModelType.REFEREE_APPEARANCE]: refereeAppearance,
  [ModelType.TEAM_MATCH_FORMATION]: teamMatchFormation,
};

export const j_mStep: {
  label: string;
  steps: FormStep<any>[];
} = {
  label: "j_mStep",
  steps: [
    ...steps[ModelType.MATCH],
    ...steps[ModelType.PLAYER_APPEARANCE],
    ...steps[ModelType.PLAYER_MATCH_EVENT_LOG],
    ...steps[ModelType.STAFF_APPEARANCE],
    ...steps[ModelType.REFEREE_APPEARANCE],
    ...steps[ModelType.TEAM_MATCH_FORMATION],
  ],
};
