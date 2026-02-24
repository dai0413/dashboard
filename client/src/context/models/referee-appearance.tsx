import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.REFEREE_APPEARANCE;
const backendRoute = API_PATHS.REFEREE_APPEARANCE;

const {
  useMetaCrud: useRefereeAppearance,
  MetaCrudProvider: RefereeAppearanceProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useRefereeAppearance, RefereeAppearanceProvider };
