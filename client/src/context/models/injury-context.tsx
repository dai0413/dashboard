import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.INJURY;
const backendRoute = API_ROUTES.INJURY;

const { useMetaCrud: useInjury, MetaCrudProvider: InjuryProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useInjury, InjuryProvider };
