import { ModelType } from "../../types/models";
import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.TEAM;
const backendRoute = API_ROUTES.TEAM;

const { useMetaCrud: useTeam, MetaCrudProvider: TeamProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useTeam, TeamProvider };
