import { playerAppearanceConfig } from "./player-appearance.js";
import { playerMatchEventLogConfig } from "./player-match-event-log.js";
import { refereeAppearanceConfig } from "./referee-appearance.js";
import { refereeConfig } from "./referee.js";
import { staffAppearanceConfig } from "./staff-appearance.js";
import { staffMatchEventLogConfig } from "./staff-match-event-log.js";
import { staffRegistrationHistoryConfig } from "./staff-registration-history.js";
import { staffConfig } from "./staff.js";
import { statsLConfig } from "./stats-l.js";
import { teamMatchFormationConfig } from "./team-match-formation.js";

export type UploadConfigMap = {
  "player-appearance": typeof playerAppearanceConfig;
  "player-match-event-log": typeof playerMatchEventLogConfig;
  "referee-appearance": typeof refereeAppearanceConfig;
  referee: typeof refereeConfig;
  staff: typeof staffConfig;
  "staff-appearance": typeof staffAppearanceConfig;
  "staff-match-event-log": typeof staffMatchEventLogConfig;
  "staff-registration-history": typeof staffRegistrationHistoryConfig;
  "stats-l": typeof statsLConfig;
  "team-match-formation": typeof teamMatchFormationConfig;
};

export const uploadConfig: {
  [K in keyof UploadConfigMap]: UploadConfigMap[K];
} = {
  "player-appearance": playerAppearanceConfig,
  "player-match-event-log": playerMatchEventLogConfig,
  "referee-appearance": refereeAppearanceConfig,
  referee: refereeConfig,
  staff: staffConfig,
  "staff-appearance": staffAppearanceConfig,
  "staff-match-event-log": staffMatchEventLogConfig,
  "staff-registration-history": staffRegistrationHistoryConfig,
  "stats-l": statsLConfig,
  "team-match-formation": teamMatchFormationConfig,
};
