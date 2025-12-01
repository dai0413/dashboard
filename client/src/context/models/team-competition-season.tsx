import { ModelType } from "../../types/models";
import { API_PATHS } from ""@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.TEAM_COMPETITION_SEASON;
const backendRoute = API_PATHS.TEAM_COMPETITION_SEASON;

const {
  useMetaCrud: useTeamCompetitionSeason,
  MetaCrudProvider: TeamCompetitionSeasonProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useTeamCompetitionSeason, TeamCompetitionSeasonProvider };
