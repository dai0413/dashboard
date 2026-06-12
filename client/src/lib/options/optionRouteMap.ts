import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../types/models";
import { BaseCrudRoutes } from "../../types/baseCrudRoutes";

export const optionRouteMap: Record<string, BaseCrudRoutes> = {
  [ModelType.PLAYER]: API_PATHS.PLAYER,
  [ModelType.TEAM]: API_PATHS.TEAM,
  [ModelType.TRANSFER]: API_PATHS.TRANSFER,
  [ModelType.COUNTRY]: API_PATHS.COUNTRY,
  [ModelType.MATCH]: API_PATHS.MATCH,
  [ModelType.MATCH_EVENT_TYPE]: API_PATHS.MATCH_EVENT_TYPE,
  [ModelType.MATCH_FORMAT]: API_PATHS.MATCH_FORMAT,
  [ModelType.NATIONAL_MATCH_SERIES]: API_PATHS.NATIONAL_MATCH_SERIES,
  [ModelType.NATIONAL_CALLUP]: API_PATHS.NATIONAL_CALLUP,
  [ModelType.SEASON]: API_PATHS.SEASON,
  [ModelType.STADIUM]: API_PATHS.STADIUM,
  [ModelType.STAFF]: API_PATHS.STAFF,
  [ModelType.COMPETITION_STAGE]: API_PATHS.COMPETITION_STAGE,
  [ModelType.COMPETITION]: API_PATHS.COMPETITION,
  [ModelType.FORMATION]: API_PATHS.FORMATION,
};
