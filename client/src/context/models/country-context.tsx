import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.COUNTRY;
const backendRoute = API_ROUTES.COUNTRY;

const { useMetaCrud: useCountry, MetaCrudProvider: CountryProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useCountry, CountryProvider };
