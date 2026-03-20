import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readItemBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Team } from "../../../../types/models/team";
import { FilterConditionsByKey } from "../../../../types/form";
import { convert } from "../../../convert/CreateLabel";

export const setMatchTeam = async (
  data?: FormTypeMap[ModelType.PLAYER_APPEARANCE],
  api?: AxiosInstance,
): Promise<FilterConditionsByKey | null> => {
  if (!data || !data.match || !api) return null;

  const resBody = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.DETAIL(data.match),
    returnResponse: true,
  });

  if (!resBody.data) return null;
  const home_team: Team = resBody.data.home_team;
  const away_team: Team = resBody.data.away_team;
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
