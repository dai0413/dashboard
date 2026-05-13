import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readItemBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Team } from "../../../../types/models/team";
import { FilterConditionsByKey } from "../../../../types/form";
import { convert } from "../../../convert/CreateLabel";
import { Match } from "../../../../types/models/match";

export const setMatchTeam = async (
  data?: FormTypeMap[ModelType.PLAYER_APPEARANCE],
  api?: AxiosInstance,
): Promise<FilterConditionsByKey | null> => {
  if (!data || !data.match || !api) return null;

  const match = await readItemBase<Match>({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.DETAIL(data.match),
    returnResponse: true,
  });

  if (!match) return null;
  const home_team: Team = match.home_team;
  const away_team: Team = match.away_team;
  if (!home_team || !away_team) return null;

  let returnObj: FilterConditionsByKey | null = {
    team: [
      {
        key: "_id",
        label: "チーム",
        type: "string",
        filterKey: "team",
        filterable: true,
        value: [home_team._id, away_team._id],
        valueLabel: [
          convert(ModelType.TEAM, home_team),
          convert(ModelType.TEAM, away_team),
        ],
        operator: "equals",
      },
    ],
  };

  return returnObj;
};
