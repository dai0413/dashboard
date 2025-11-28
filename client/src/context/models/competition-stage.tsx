import { API_PATHS } from "@myorg/shared";
import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.COMPETITION_STAGE;
const backendRoute = API_PATHS.COMPETITION_STAGE;

const {
  useMetaCrud: useCompetitionStage,
  MetaCrudProvider: CompetitionStageProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useCompetitionStage, CompetitionStageProvider };
