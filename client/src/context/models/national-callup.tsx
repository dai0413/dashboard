import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.NATIONAL_CALLUP;
const backendRoute = API_ROUTES.NATIONAL_CALLUP;

const {
  useMetaCrud: useNationalCallup,
  MetaCrudProvider: NationalCallupProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useNationalCallup, NationalCallupProvider };
