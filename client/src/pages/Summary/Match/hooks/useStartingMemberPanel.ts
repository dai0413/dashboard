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
  const [homeIsLoading, setHomeIsLoading] = useState<boolean>(false);
  const [awayPlayers, setAwayPlayers] = useState<PlayerAppearanceGet[]>([]);
  const [awayIsLoading, setAwayIsLoading] = useState<boolean>(false);

  const fetchData = async (
    matchId: string,
    setIsLoading: (val: boolean) => void,
    setData: (data: PlayerAppearanceGet[]) => void,
    teamId?: string,
  ) => {
    setIsLoading(true);
    if (!matchId || !teamId) return setIsLoading(false);
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

    setIsLoading(false);
  };

  const readStartingMembers = async (
    matchId: string,
    homeTeamId?: string,
    awayTeamId?: string,
  ) => {
    fetchData(matchId, setHomeIsLoading, setHomePlayers, homeTeamId);
    fetchData(matchId, setAwayIsLoading, setAwayPlayers, awayTeamId);
  };

  return {
    startingMembers: {
      home: homePlayers,
      away: awayPlayers,
      isLoadin: homeIsLoading && awayIsLoading,
    },
    readStartingMembers,
  };
};
