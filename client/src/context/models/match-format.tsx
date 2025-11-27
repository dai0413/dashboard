import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "@myorg/shared";

const ContextModelString = ModelType.MATCH_FORMAT;
const backendRoute = API_PATHS.MATCH_FORMAT;

const { useMetaCrud: useMatchFormat, MetaCrudProvider: MatchFormatProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useMatchFormat, MatchFormatProvider };
