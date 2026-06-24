import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { multiModel as match } from "../models/match/forms/d_ml";
import { multiModel as playerAppearance } from "../models/player-appearance/forms/d_ml";
import { multiModel as playerMatchEventLog } from "../models/player-match-event-log/forms/d_ml";
import { multiModel as staffAppearance } from "../models/staff-appearance/forms/d_ml";
import { multiModel as refereeAppearance } from "../models/referee-appearance/forms/d_ml";
import { multiModel as staffMatchEventLog } from "../models/staff-match-event-log/forms/d_ml";
import { multiModel as teamMatchFormation } from "../models/team-match-formation/forms/l_m";
import { multiModel as statsL } from "../models/stats-l/forms/l_m";
import { preStep } from "./preStep";

type Steps = {
  [ModelType.MATCH]: FormStep<ModelType.MATCH>[];
  [ModelType.PLAYER_APPEARANCE]: FormStep<ModelType.PLAYER_APPEARANCE>[];
  [ModelType.PLAYER_MATCH_EVENT_LOG]: FormStep<ModelType.PLAYER_MATCH_EVENT_LOG>[];
  [ModelType.STAFF_APPEARANCE]: FormStep<ModelType.STAFF_APPEARANCE>[];
  [ModelType.STAFF_MATCH_EVENT_LOG]: FormStep<ModelType.STAFF_MATCH_EVENT_LOG>[];
  [ModelType.REFEREE_APPEARANCE]: FormStep<ModelType.REFEREE_APPEARANCE>[];
  [ModelType.TEAM_MATCH_FORMATION]: FormStep<ModelType.TEAM_MATCH_FORMATION>[];
  [ModelType.STATS_L]: FormStep<ModelType.STATS_L>[];
};

const steps: Steps = {
  [ModelType.MATCH]: match,
  [ModelType.PLAYER_APPEARANCE]: playerAppearance,
  [ModelType.PLAYER_MATCH_EVENT_LOG]: playerMatchEventLog,
  [ModelType.STAFF_APPEARANCE]: staffAppearance,
  [ModelType.STAFF_MATCH_EVENT_LOG]: staffMatchEventLog,
  [ModelType.REFEREE_APPEARANCE]: refereeAppearance,
  [ModelType.TEAM_MATCH_FORMATION]: teamMatchFormation,
  [ModelType.STATS_L]: statsL,
};

export const d_mlStep: {
  label: string;
  steps: FormStep<any>[];
} = {
  label: "d_mlStep",
  steps: [
    ...preStep,
    ...steps[ModelType.MATCH],
    ...steps[ModelType.PLAYER_APPEARANCE],
    ...steps[ModelType.PLAYER_MATCH_EVENT_LOG],
    ...steps[ModelType.STAFF_APPEARANCE],
    ...steps[ModelType.STAFF_MATCH_EVENT_LOG],
    ...steps[ModelType.REFEREE_APPEARANCE],
    ...steps[ModelType.TEAM_MATCH_FORMATION],
    ...steps[ModelType.STATS_L],
  ],
};
