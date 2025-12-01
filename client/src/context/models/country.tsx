import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from ""@dai0413/myorg-shared";

const ContextModelString = ModelType.COUNTRY;
const backendRoute = API_PATHS.COUNTRY;

const { useMetaCrud: useCountry, MetaCrudProvider: CountryProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useCountry, CountryProvider };
