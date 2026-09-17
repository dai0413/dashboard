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
  const [homePlayers, setHomePlayers] = useState<PlayerAppearanceGet[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<PlayerAppearanceGet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async (
    matchId: string,
    setData: (data: PlayerAppearanceGet[]) => void,
    teamId?: string,
  ) => {
    if (!matchId || !teamId) return;
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

      setData(converted);
    }
  };

  const readStartingMembers = async (
    matchId: string,
    homeTeamId?: string,
    awayTeamId?: string,
  ) => {
    setIsLoading(true);
    await fetchData(matchId, setHomePlayers, homeTeamId);
    await fetchData(matchId, setAwayPlayers, awayTeamId);
    setIsLoading(false);
  };

  return {
    startingMembers: {
      home: homePlayers,
      away: awayPlayers,
      isLoading: isLoading,
    },
    readStartingMembers,
  };
};
