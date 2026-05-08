import { ModelType } from "../../types/models";
import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/model/createModelContext";

const ContextModelString = ModelType.TEAM_MATCH_FORMATION;
const backendRoute = API_PATHS.TEAM_MATCH_FORMATION;

const {
  useMetaCrud: useTeamMatchFormation,
  MetaCrudProvider: TeamMatchFormationProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useTeamMatchFormation, TeamMatchFormationProvider };
