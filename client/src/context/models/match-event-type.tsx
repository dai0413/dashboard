import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "@dai0413/myorg-shared";

const ContextModelString = ModelType.MATCH_EVENT_TYPE;
const backendRoute = API_PATHS.MATCH_EVENT_TYPE;

const {
  useMetaCrud: useMatchEventType,
  MetaCrudProvider: MatchEventTypeProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useMatchEventType, MatchEventTypeProvider };
