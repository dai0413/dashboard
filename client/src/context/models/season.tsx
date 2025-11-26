import { ModelType } from "../../types/models";
import { API_PATHS } from "../../lib/api-paths";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.SEASON;
const backendRoute = API_PATHS.SEASON;

const { useMetaCrud: useSeason, MetaCrudProvider: SeasonProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useSeason, SeasonProvider };
