import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.COMPETITION;
const backendRoute = API_ROUTES.COMPETITION;

const { useMetaCrud: useCompetition, MetaCrudProvider: CompetitionProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useCompetition, CompetitionProvider };
