import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "../../lib/api-paths";

const ContextModelString = ModelType.COMPETITION_STAGE;
const backendRoute = API_PATHS.COMPETITION_STAGE;

const {
  useMetaCrud: useCompetitionStage,
  MetaCrudProvider: CompetitionStageProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useCompetitionStage, CompetitionStageProvider };
