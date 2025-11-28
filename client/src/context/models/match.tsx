import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "@myorg/shared";

const ContextModelString = ModelType.MATCH;
const backendRoute = API_PATHS.MATCH;

const { useMetaCrud: useMatch, MetaCrudProvider: MatchProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useMatch, MatchProvider };
