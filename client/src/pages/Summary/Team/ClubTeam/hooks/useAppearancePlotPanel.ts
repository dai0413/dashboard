import { useState } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  QueryParams,
  SortableFieldDefinition,
  sortByPosition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { createItemBase, readItemsBase } from "../../../../../lib/api";
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
import { FormationCounts } from "../types";
import { getFormationCounts } from "../../../../../utils/data";

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

  const readAppearancePlot = async (
    _filterConditions: FilterableFieldDefinition[],
    _sortConditions: SortableFieldDefinition[],
    teamId: string,
    date: string[],
  ) => {
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

      const formationCounts = await getFormationCounts(teamId, matchIds);
      formationCounts && setFormationCounts(formationCounts);
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
      match: matchIds,
    };

    if (matchIds.length > 0) {
      params["_id"] = matchIds;
    }

    const playerStatistic = await createItemBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      data: params,
    });

    if (playerStatistic?.success) {
      setPlayerStatistics(sortByPosition(playerStatistic.data, "mainPosition"));
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
