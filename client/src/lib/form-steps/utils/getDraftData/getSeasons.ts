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

  const res = await readItemsBase({
    apiInstance: api,
    backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
    params: {
      getAll: true,
      team,
      "season.start_date": `<=${iso}`,
      "season.end_date": `>=${iso}`,
    },
    returnResponse: true,
  });

  if (!res) return [];

  const TeamCompetitionSeason: TeamCompetitionSeason[] = res.data;

  const seasonIds = TeamCompetitionSeason.map((t) => t.season._id);

  return seasonIds;
};
