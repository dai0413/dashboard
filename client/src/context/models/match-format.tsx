import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.MATCH_FORMAT;
const backendRoute = API_ROUTES.MATCH_FORMAT;

const { useMetaCrud: useMatchFormat, MetaCrudProvider: MatchFormatProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useMatchFormat, MatchFormatProvider };
