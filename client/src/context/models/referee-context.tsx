import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.REFEREE;
const backendRoute = API_ROUTES.REFEREE;

const { useMetaCrud: useReferee, MetaCrudProvider: RefereeProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useReferee, RefereeProvider };
