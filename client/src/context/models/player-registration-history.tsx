import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER_REGISTRATION_HISTORY;
const backendRoute = API_PATHS.PLAYER_REGISTRATION_HISTORY;

const {
  useMetaCrud: usePlayerRegistrationHistory,
  MetaCrudProvider: PlayerRegistrationHistoryProvider,
} = createModelContext(ContextModelString, backendRoute);

export { usePlayerRegistrationHistory, PlayerRegistrationHistoryProvider };
