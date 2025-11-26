import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "../../lib/api-paths";

const ContextModelString = ModelType.COUNTRY;
const backendRoute = API_PATHS.COUNTRY;

const { useMetaCrud: useCountry, MetaCrudProvider: CountryProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useCountry, CountryProvider };
