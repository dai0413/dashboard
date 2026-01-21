import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER_MATCH_EVENT_LOG;
const backendRoute = API_PATHS.PLAYER_MATCH_EVENT_LOG;

const {
  useMetaCrud: usePlayerMatchEventLog,
  MetaCrudProvider: PlayerMatchEventLogProvider,
} = createModelContext(ContextModelString, backendRoute);

export { usePlayerMatchEventLog, PlayerMatchEventLogProvider };
