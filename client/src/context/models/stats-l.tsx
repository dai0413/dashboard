import { ModelType } from "../../types/models";
import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/model/createModelContext";

const ContextModelString = ModelType.STATS_L;
const backendRoute = API_PATHS.STATS_L;

const { useMetaCrud: useStatsL, MetaCrudProvider: StatsLProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useStatsL, StatsLProvider };
