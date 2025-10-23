import { ModelType } from "../../types/models";
import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.TEAM_COMPETITION_SEASON;
const backendRoute = API_ROUTES.TEAM_COMPETITION_SEASON;

const {
  useMetaCrud: useTeamCompetitionSeason,
  MetaCrudProvider: TeamCompetitionSeasonProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useTeamCompetitionSeason, TeamCompetitionSeasonProvider };
