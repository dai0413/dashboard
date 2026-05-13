import { API_PATHS } from "@dai0413/myorg-shared";
import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { readItemBase } from "../../../../api";
import { setPlayerQuickFilter } from "../../../utils/createQuickFilterItems/setMatchPlayer";
import { Season } from "../../../../../types/models/season";

export const playerInSeason = async (
  data?: FormTypeMap[ModelType.PLAYER_REGISTRATION_HISTORY],
  api?: AxiosInstance | undefined,
) => {
  if (!data || !api || !data.team) return null;
  const { team } = data;
  const { season: seasonId } = data;

  const season = await readItemBase<Season>({
    apiInstance: api,
    backendRoute: API_PATHS.SEASON.DETAIL(seasonId),
    returnResponse: true,
  });

  if (!season) return null;

  const transferFromDate = season.start_date || undefined;
  const transferToDate = season.end_date || undefined;

  const quickFilterItems = setPlayerQuickFilter(
    api,
    team,
    season.competition,
    season,
    transferFromDate,
    transferToDate,
  );

  return quickFilterItems;
};
