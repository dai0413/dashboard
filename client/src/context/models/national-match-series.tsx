import { ModelType } from "../../types/models";

import { createModelContext } from "../../utils/createModelContext";
import { API_PATHS } from "@myorg/shared";

const ContextModelString = ModelType.NATIONAL_MATCH_SERIES;
const backendRoute = API_PATHS.NATIONAL_MATCH_SERIES;

const {
  useMetaCrud: useNationalMatchSeries,
  MetaCrudProvider: NationalMatchSeriesProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useNationalMatchSeries, NationalMatchSeriesProvider };
