import { useMemo, useState } from "react";
import { API_PATHS, OptionArray } from "@dai0413/myorg-shared";
import { api } from "../../../../../context/api-context";
import { Data } from "../../../../../types/types";
import { readItemsBase } from "../../../../../lib/api";
import { TeamCompetitionSeason } from "../../../../../types/models/team-competition-season";
import { ModelDataMap, ModelType } from "../../../../../types/models";
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

  const readTeamCompetitionSeason = async (
    teamId: string,
  ): Promise<Data<ModelDataMap[ModelType.TEAM_COMPETITION_SEASON]> | null> => {
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

    if (!obj) return null;

    const nextItems = {
      data: obj.data,
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setTeamCompetitionSeason(nextItems);

    return nextItems;
  };

  return {
    teamCompetitionSeason,
    readTeamCompetitionSeason,
    seasonOptions,
    setTeamCompetitionSeason,
  };
};
