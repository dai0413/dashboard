import { useMemo, useState } from "react";
import { API_PATHS, OptionArray } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { Data } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { TeamCompetitionSeason } from "../../../../../types/models/team-competition-season";
import { ModelType } from "../../../../../types/models";
import { convert } from "../../../../../lib/convert/CreateLabel";

export const useTeamCompetitionSeasonPanel = () => {
  const [teamCompetitionSeason, setTeamCompetitionSeason] = useState<
    Data<TeamCompetitionSeason>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: true,
  });

  const seasonOptions: OptionArray = useMemo(
    () =>
      teamCompetitionSeason.data.map((s) => {
        const label = convert(ModelType.SEASON, s.season);

        return {
          key: s._id,
          label: label,
        };
      }),
    [teamCompetitionSeason],
  );

  const readTeamCompetitionSeason = async (teamId: string) => {
    const obj = await readItemsBase<TeamCompetitionSeason[]>({
      apiInstance: api,
      backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
      params: {
        team: teamId,
        "competition.category": "league",
        "competition.level": "exists",
        getAll: true,
      },
      handleLoading: (time) => {
        setTeamCompetitionSeason((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (obj) {
      setTeamCompetitionSeason({
        data: obj.data,
        totalCount: obj.totalCount ? obj.totalCount : 0,
        page: obj.page ? obj.page : 1,
        isLoading: false,
      });

      return obj.data;
    }
  };

  return {
    teamCompetitionSeason,
    readTeamCompetitionSeason,
    seasonOptions,
  };
};
