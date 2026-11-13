import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../../types/models/player-appearance";

export const useStartingMemberPanel = () => {
  const [startingMembers, setStartingMembers] = useState<{
    home: PlayerAppearanceGet[];
    away: PlayerAppearanceGet[];
  }>({ home: [], away: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async (matchId: string, teamId: string) => {
    const readParams: Record<string, any> = {
      getAll: true,
      match: matchId,
      team: teamId,
      play_status: "start",
    };

    const obj = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: readParams,
    });

    if (obj?.data) {
      const converted = convert(ModelType.PLAYER_APPEARANCE, obj.data);

      return converted;
    }

    return [];
  };

  const readStartingMembers = async (
    matchId: string,
    homeTeamId?: string,
    awayTeamId?: string,
  ): Promise<{
    home: PlayerAppearanceGet[];
    away: PlayerAppearanceGet[];
  } | null> => {
    if (!homeTeamId && !awayTeamId) return null;
    setIsLoading(true);
    const home = homeTeamId ? await fetchData(matchId, homeTeamId) : [];
    const away = awayTeamId ? await fetchData(matchId, awayTeamId) : [];

    setStartingMembers({ home, away });
    setIsLoading(false);

    return { home, away };
  };

  return {
    startingMembers: {
      home: startingMembers.home,
      away: startingMembers.away,
      isLoading: isLoading,
    },
    readStartingMembers,
    setStartingMembers,
  };
};
