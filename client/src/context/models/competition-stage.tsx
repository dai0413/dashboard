import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.COMPETITION_STAGE;
const backendRoute = API_ROUTES.COMPETITION_STAGE;

const {
  useMetaCrud: useCompetitionStage,
  MetaCrudProvider: CompetitionStageProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useCompetitionStage, CompetitionStageProvider };
