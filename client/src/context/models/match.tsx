import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.MATCH;
const backendRoute = API_ROUTES.MATCH;

const { useMetaCrud: useMatch, MetaCrudProvider: MatchProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useMatch, MatchProvider };
