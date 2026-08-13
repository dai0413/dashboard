import { useState } from "react";
import { API_PATHS, QueryParams } from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../../lib/api";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../../../types/models/player-appearance";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { Match, MatchGet } from "../../../../../types/models/match";
import {
  PlayerRegistration,
  PlayerRegistrationGet,
} from "../../../../../types/models/player-registration";
import { TeamMatchFormation } from "../../../../../types/models/team-match-formation";
import { FormationCounts } from "../types";
import { Formation } from "../../../../../types/models/formation";

export const useAppearancePlotPanel = () => {
  const [appearancePlotIsLoading, setAppearancePlotIsLoading] =
    useState<boolean>(false);
  const [playerAppearance, setPlayerAppearance] = useState<
    PlayerAppearanceGet[]
  >([]);
  const [playerRegistrations, setPlayerRegistrations] = useState<
    PlayerRegistrationGet[]
  >([]);
  const [matches, setMatches] = useState<MatchGet[]>([]);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistic[]>(
    [],
  );
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);

  const readAppearancePlot = async (teamId: string, date: string[]) => {
    setAppearancePlotIsLoading(true);

    let playerIds: string[] = [];

    const match = await readItemsBase<Match[]>({
      apiInstance: api,
      backendRoute: API_PATHS.MATCH.ROOT,
      params: { getAll: true, team: teamId, date },
    });

    if (match?.data) setMatches(convert(ModelType.MATCH, match?.data));

    const matchIds = [...(new Set(match?.data.map((m) => m._id)) ?? [])];

    if (matchIds && matchIds.length > 0) {
      const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
        apiInstance: api,
        backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
        params: { getAll: true, team: teamId, match: matchIds },
      });

      if (playerAppearanceRes?.data) {
        const newPlayerAppearance = convert(
          ModelType.PLAYER_APPEARANCE,
          playerAppearanceRes.data,
        );
        setPlayerAppearance(newPlayerAppearance);
      }

      playerIds = [
        ...new Set([
          ...playerIds,
          ...(playerAppearanceRes?.data ?? []).map((d) => d.player._id),
        ]),
      ];

      const teamMatchFormationRes = await readItemsBase<TeamMatchFormation[]>({
        apiInstance: api,
        backendRoute: API_PATHS.TEAM_MATCH_FORMATION.ROOT,
        params: { getAll: true, team: teamId, match: matchIds },
      });

      if (teamMatchFormationRes?.data) {
        const formationCounts = Array.from(
          teamMatchFormationRes.data
            .reduce((map, item) => {
              const formationId = item.formation._id;

              if (!formationId) {
                return map;
              }

              const current = map.get(formationId);

              map.set(formationId, {
                formation: item.formation,
                count: (current?.count ?? 0) + 1,
              });

              return map;
            }, new Map<string, { formation: Formation; count: number }>())
            .values(),
        ).sort((a, b) => b.count - a.count);

        setFormationCounts(formationCounts);
      }
    }

    const playerRegistration = await readItemsBase<PlayerRegistration[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
      params: { getAll: true, team: teamId, date },
    });

    if (playerRegistration?.data) {
      const newPlayerRegistration = convert(
        ModelType.PLAYER_REGISTRATION,
        playerRegistration.data,
      );
      setPlayerRegistrations(newPlayerRegistration);
    }

    playerIds = [
      ...new Set([
        ...playerIds,
        ...(playerRegistration?.data ?? []).map((d) => d.player._id),
      ]),
    ];

    const params: QueryParams = {
      player: playerIds,
      team: teamId,
    };

    if (matchIds.length > 0) {
      params["_id"] = matchIds;
    }

    const playerStatistic = await readItemsBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      params: params,
    });

    if (playerStatistic?.data) {
      setPlayerStatistics(playerStatistic.data);
    }

    setAppearancePlotIsLoading(false);
  };

  return {
    playerAppearance,
    playerRegistrations,
    playerStatistics,
    matches,
    formationCounts,
    appearancePlotIsLoading,
    readAppearancePlot,
  };
};
