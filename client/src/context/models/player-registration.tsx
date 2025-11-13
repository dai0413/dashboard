import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER_REGISTRATION;
const backendRoute = API_ROUTES.PLAYER_REGISTRATION;

const {
  useMetaCrud: usePlayerRegistration,
  MetaCrudProvider: PlayerRegistrationProvider,
} = createModelContext(ContextModelString, backendRoute);

export { usePlayerRegistration, PlayerRegistrationProvider };
