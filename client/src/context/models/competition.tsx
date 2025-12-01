import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "@dai0413/myorg-shared";

const ContextModelString = ModelType.COMPETITION;
const backendRoute = API_PATHS.COMPETITION;

const { useMetaCrud: useCompetition, MetaCrudProvider: CompetitionProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useCompetition, CompetitionProvider };
