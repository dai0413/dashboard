import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../types/models";
import { Data } from "../../../../types/types";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";

export const useTeamCompetitionSeasonPanel = () => {
  const [teamCompetitionSeasons, setTeamCompetitionSeasons] = useState<
    Data<GettedModelDataMap[ModelType.TEAM_COMPETITION_SEASON]>
  >({
    data: [],
    page: 1,
    totalCount: 1,
    isLoading: false,
  });

  const readTeamCompetitionSeasons = async (
    competitionId: string,
    seasonId?: string,
  ): Promise<Data<
    GettedModelDataMap[ModelType.TEAM_COMPETITION_SEASON]
  > | null> => {
    if (!seasonId) return null;
    const obj = await readItemsBase<
      ModelDataMap[ModelType.TEAM_COMPETITION_SEASON][]
    >({
      apiInstance: api,
      backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
      params: {
        getAll: true,
        competition: competitionId,
        season: seasonId,
      },
      handleLoading: (time) => {
        setTeamCompetitionSeasons((prev) => ({
          ...prev,
          isLoading: time === "start",
        }));
      },
    });

    if (!obj) return null;

    const nextItems = {
      data: convert(ModelType.TEAM_COMPETITION_SEASON, obj.data),
      totalCount: obj.totalCount ?? 0,
      page: obj.page ?? 1,
      isLoading: false,
    };

    setTeamCompetitionSeasons(nextItems);

    return nextItems;
  };

  return {
    teamCompetitionSeasons,
    readTeamCompetitionSeasons,
    setTeamCompetitionSeasons,
  };
};
