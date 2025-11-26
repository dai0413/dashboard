import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "../../lib/api-paths";

const ContextModelString = ModelType.NATIONAL_CALLUP;
const backendRoute = API_PATHS.NATIONAL_CALLUP;

const {
  useMetaCrud: useNationalCallup,
  MetaCrudProvider: NationalCallupProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useNationalCallup, NationalCallupProvider };
