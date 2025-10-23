import { ModelType } from "../../types/models";
import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.SEASON;
const backendRoute = API_ROUTES.SEASON;

const { useMetaCrud: useSeason, MetaCrudProvider: SeasonProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useSeason, SeasonProvider };
