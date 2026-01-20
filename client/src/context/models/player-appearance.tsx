import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.PLAYER_APPEARANCE;
const backendRoute = API_PATHS.PLAYER_APPEARANCE;

const {
  useMetaCrud: usePlayerAppearance,
  MetaCrudProvider: PlayerAppearanceProvider,
} = createModelContext(ContextModelString, backendRoute);

export { usePlayerAppearance, PlayerAppearanceProvider };
