import { playerAppearanceConfig } from "./player-appearance.js";
import { playerMatchEventLogConfig } from "./player-match-event-log.js";
import { staffAppearanceConfig } from "./staff-appearance.js";
import { staffMatchEventLogConfig } from "./staff-match-event-log.js";

export type UploadConfigMap = {
  "player-appearance": typeof playerAppearanceConfig;
  "player-match-event-log": typeof playerMatchEventLogConfig;
  "staff-appearance": typeof staffAppearanceConfig;
  "staff-match-event-log": typeof staffMatchEventLogConfig;
};

export const uploadConfig: {
  [K in keyof UploadConfigMap]: UploadConfigMap[K];
} = {
  "player-appearance": playerAppearanceConfig,
  "player-match-event-log": playerMatchEventLogConfig,
  "staff-appearance": staffAppearanceConfig,
  "staff-match-event-log": staffMatchEventLogConfig,
};
