import { FormStep } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { multiModel as match } from "../models/match/forms/d_ml";
import { playerAppearance } from "../models/player-appearance/forms/d_ml";
import { playerMatchEventLog } from "../models/player-match-event-log/forms/d_ml";
import { staffAppearance } from "../models/staff-appearance/forms/d_ml";
import { refereeAppearance } from "../models/referee-appearance/forms/d_ml";
import { staffMatchEventLog } from "../models/staff-match-event-log/forms/d_ml";
import { preStep } from "./preStep";

type Steps = {
  [ModelType.MATCH]: FormStep<ModelType.MATCH>[];
  [ModelType.PLAYER_APPEARANCE]: FormStep<ModelType.PLAYER_APPEARANCE>[];
  [ModelType.PLAYER_MATCH_EVENT_LOG]: FormStep<ModelType.PLAYER_MATCH_EVENT_LOG>[];
  [ModelType.STAFF_APPEARANCE]: FormStep<ModelType.STAFF_APPEARANCE>[];
  [ModelType.STAFF_MATCH_EVENT_LOG]: FormStep<ModelType.STAFF_MATCH_EVENT_LOG>[];
  [ModelType.REFEREE_APPEARANCE]: FormStep<ModelType.REFEREE_APPEARANCE>[];
};

const steps: Steps = {
  [ModelType.MATCH]: match,
  [ModelType.PLAYER_APPEARANCE]: playerAppearance,
  [ModelType.PLAYER_MATCH_EVENT_LOG]: playerMatchEventLog,
  [ModelType.STAFF_APPEARANCE]: staffAppearance,
  [ModelType.STAFF_MATCH_EVENT_LOG]: staffMatchEventLog,
  [ModelType.REFEREE_APPEARANCE]: refereeAppearance,
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
  ],
};
