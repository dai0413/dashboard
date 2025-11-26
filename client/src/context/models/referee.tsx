import { ModelType } from "../../types/models";

import { API_PATHS } from "../../lib/api-paths";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.REFEREE;
const backendRoute = API_PATHS.REFEREE;

const { useMetaCrud: useReferee, MetaCrudProvider: RefereeProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useReferee, RefereeProvider };
