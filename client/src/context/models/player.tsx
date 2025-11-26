import { ModelType } from "../../types/models";

import { API_PATHS } from "../../lib/api-paths";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER;
const backendRoute = API_PATHS.PLAYER;

const { useMetaCrud: usePlayer, MetaCrudProvider: PlayerProvider } =
  createModelContext(ContextModelString, backendRoute);

export { usePlayer, PlayerProvider };
