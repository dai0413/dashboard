import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.NATIONAL_MATCH_SERIES;
const backendRoute = API_ROUTES.NATIONAL_MATCH_SERIES;

const {
  useMetaCrud: useNationalMatchSeries,
  MetaCrudProvider: NationalMatchSeriesProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useNationalMatchSeries, NationalMatchSeriesProvider };
