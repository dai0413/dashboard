import { API_PATHS } from "@dai0413/myorg-shared";
import { AxiosInstance } from "axios";
import { ModelType } from "../../../../../../types/models";
import { readItemsBase } from "../../../../../api";
import { Team } from "../../../../../../types/models/team";
import { QuickFilterItem } from "../../../../../../types/table";
import { convert } from "../../../../../convert/CreateLabel";

export const setTeam = async (
  metaData?: Record<string, any>,
  api?: AxiosInstance | undefined,
) => {
  if (!api || !metaData || !metaData.country) return null;

  const teams = await readItemsBase<Team[]>({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM.ROOT,
    params: {
      getAll: true,
      sort: "age_group",
      genre: "national",
      country: metaData.country,
    },
  });

  if (!teams) return null;

  const value = teams.data.map((team) => team._id);
  const valueLabel = teams.data.map((team) => convert(ModelType.TEAM, team));

  let result: QuickFilterItem[] = [
    {
      key: "team",
      label: "チーム",
      filterCondition: [
        {
          key: "_id",
          label: "チーム",
          type: "string",
          filterable: true,
          value,
          valueLabel,
          operator: "equals",
        },
      ],
      defaultSelect: true,
    },
  ];

  return { team: result };
};
