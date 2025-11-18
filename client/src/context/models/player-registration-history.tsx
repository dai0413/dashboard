import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER_REGISTRATION_HISTORY;
const backendRoute = API_ROUTES.PLAYER_REGISTRATION_HISTORY;

const {
  useMetaCrud: usePlayerRegistrationHistory,
  MetaCrudProvider: PlayerRegistrationHistoryProvider,
} = createModelContext(ContextModelString, backendRoute);

export { usePlayerRegistrationHistory, PlayerRegistrationHistoryProvider };
