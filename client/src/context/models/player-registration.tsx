import { ModelType } from "../../types/models";

import { API_PATHS } from "@myorg/shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER_REGISTRATION;
const backendRoute = API_PATHS.PLAYER_REGISTRATION;

const {
  useMetaCrud: usePlayerRegistration,
  MetaCrudProvider: PlayerRegistrationProvider,
} = createModelContext(ContextModelString, backendRoute);

export { usePlayerRegistration, PlayerRegistrationProvider };
