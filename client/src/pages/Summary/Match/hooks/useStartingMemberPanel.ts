import { useState } from "react";
import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../../lib/api";
import { convert } from "../../../../lib/convert/DBtoGetted";
import { api } from "../../../../context/api-context";
import { FormationItem } from "../../../../types/formation";
import { PlayerAppearance } from "../../../../types/models/player-appearance";
import { positionBase } from "../../../../components/formation/positionBase";
import { APP_ROUTES } from "../../../../lib/appRoutes";

export const useStartingMemberPanel = () => {
  const [homePlayers, setHomePlayers] = useState<FormationItem[]>([]);
  const [homeIsLoading, setHomeIsLoading] = useState<boolean>(false);
  const [awayPlayers, setAwayPlayers] = useState<FormationItem[]>([]);
  const [awayIsLoading, setAwayIsLoading] = useState<boolean>(false);

  const fetchData = async (
    matchId: string,
    setIsLoading: (val: boolean) => void,
    setData: (data: FormationItem[]) => void,
    teamId?: string,
  ) => {
    setIsLoading(true);
    if (!matchId || !teamId) return setIsLoading(false);
    const readParams: Record<string, any> = {
      getAll: true,
      match: matchId,
      team: teamId,
    };

    const obj = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: readParams,
    });

    if (obj?.data) {
      const converted = convert(ModelType.PLAYER_APPEARANCE, obj.data);

      const items: FormationItem[] = converted.map((p) => ({
        position: p.position as keyof typeof positionBase,
        centerText: p.number,
        label: p.player?.label,
        link: p.player.id
          ? `${APP_ROUTES.PLAYER_SUMMARY}/${p.player.id}`
          : undefined,
        tooltip: [
          { text: p.player?.label ?? "", bold: true },
          { text: `背番号 ${p.number}` },
        ],
      }));

      setData(items);
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
