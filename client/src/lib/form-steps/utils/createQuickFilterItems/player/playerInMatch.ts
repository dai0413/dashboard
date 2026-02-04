import { API_PATHS } from "@dai0413/myorg-shared";
import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { readItemBase } from "../../../../api";
import { setPlayerQuickFilter } from "../../../utils/createQuickFilterItems/setMatchPlayer";
import { Match } from "../../../../../types/models/match";

export const playerInMatch = async (
  data:
    | FormTypeMap[ModelType.PLAYER_APPEARANCE]
    | FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG],
  api: AxiosInstance | undefined,
) => {
  const { team, match: matchId } = data;
  if (!api || !team) return null;

  const matchResBody = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.DETAIL(matchId),
    returnResponse: true,
  });

  const match: Match = matchResBody.data;

  const transferFromDate = match.season.start_date || undefined;
  const transferToDate = match.date || undefined;

  const quickFilterItems = setPlayerQuickFilter(
    api,
    team,
    match.competition,
    match.season,
    transferFromDate,
    transferToDate,
  );

  return quickFilterItems;
};
