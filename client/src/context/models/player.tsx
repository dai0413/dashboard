import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER;
const backendRoute = API_ROUTES.PLAYER;

const { useMetaCrud: usePlayer, MetaCrudProvider: PlayerProvider } =
  createModelContext(ContextModelString, backendRoute);

export { usePlayer, PlayerProvider };
