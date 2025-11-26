import { ModelType } from "../../types/models";
import { API_PATHS } from "../../lib/api-paths";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.TEAM;
const backendRoute = API_PATHS.TEAM;

const { useMetaCrud: useTeam, MetaCrudProvider: TeamProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useTeam, TeamProvider };
