import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { AxiosInstance } from "axios";
import { readItemsBase } from "../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { TeamCompetitionSeason } from "../../../../types/models/team-competition-season";

export const getSeasons = async (
  api?: AxiosInstance,
  team?: string,
  date?: Date,
) => {
  if (!team || !api || !date) return [];

  const iso = toDateKey(date, true);

  const obj = await readItemsBase<TeamCompetitionSeason[]>({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
    params: {
      getAll: true,
      team,
      "season.start_date": `<=${iso}`,
      "season.end_date": `>=${iso}`,
    },
  });

  if (!obj) return [];

  const seasonIds = obj.data.map((t) => t.season._id);

  return seasonIds;
};
