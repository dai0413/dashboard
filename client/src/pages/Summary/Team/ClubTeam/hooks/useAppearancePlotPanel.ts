import { useMemo, useState } from "react";
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
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import {
  createGroupedPlayers,
  getAgeLabel,
} from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import { QuickFilterData } from "../../../../../types/table";
import { CompetitionGet } from "../../../../../types/models/competition";

export const useAppearancePlotPanel = (teamId: string, date: string[]) => {
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
  const [competitions, setCompetitions] = useState<CompetitionGet[]>([]);

  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(
    [],
  );
  const [selectedFormation, setSelectedFormation] = useState<
    string | undefined
  >(undefined);

  const [filteredMatches, setFilteredMatches] = useState<MatchGet[]>([]);

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

    if (match?.data) {
      const matches = convert(ModelType.MATCH, match?.data);
      setMatches(matches);
      setFilteredMatches(matches);

      const competitions = new Map(
        match?.data.map((m) => {
          const competition = convert(ModelType.COMPETITION, m.competition);
          return [competition._id, competition];
        }),
      );

      const newCompetitions = [...competitions.values()];
      const newSelectedCompetitions = newCompetitions.map((c) => c._id);

      setCompetitions([...competitions.values()]);
      setSelectedCompetitions(newSelectedCompetitions);
    }

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

    const playerRegistrationRes = await readItemsBase<PlayerRegistration[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
      params: { getAll: true, team: teamId, date },
    });

    let newPlayerRegistration = playerRegistrations;

    if (playerRegistrationRes?.data) {
      newPlayerRegistration = convert(
        ModelType.PLAYER_REGISTRATION,
        playerRegistrationRes.data,
      );
      setPlayerRegistrations(newPlayerRegistration);
    }

    playerIds = [
      ...new Set([
        ...playerIds,
        ...(playerRegistrationRes?.data ?? []).map((d) => d.player._id),
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
      const players = playerStatistic.data.map((playerStatistic) => {
        const targetRegister = newPlayerRegistration.find(
          (p) => p.player.id === playerStatistic.player._id,
        );

        let note: string | undefined;

        if (targetRegister?.isTypeTwo) note = "2種";
        if (targetRegister?.isSpecialDesignation) note = "特指";

        return {
          ...playerStatistic,
          ageLabel: playerStatistic.player.dob
            ? getAgeLabel(
                new Date(playerStatistic.player.dob),
                new Date(date[0]),
                new Date(date[1]),
              )
            : undefined,
          note,
        };
      });

      setPlayerStatistics(sortByPosition(players, "mainPosition"));
    }

    setAppearancePlotIsLoading(false);
  };

  type HandleClickCompetition = {
    matchIds: string[];
  };
  const handleClickCompetition = async ({
    matchIds,
  }: HandleClickCompetition) => {
    if (!teamId || !date) return;

    setAppearancePlotIsLoading(true);

    const formationCounts = await getFormationCounts(teamId, matchIds);

    if (formationCounts) {
      setFormationCounts(formationCounts);
    } else {
      setFormationCounts([]);
    }

    let playerIds: string[] = [];

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
      const players = playerStatistic.data.map((playerStatistic) => {
        const targetRegister = playerRegistrations.find(
          (p) => p.player.id === playerStatistic.player._id,
        );

        let note: string | undefined;

        if (targetRegister?.isTypeTwo) note = "2種";
        if (targetRegister?.isSpecialDesignation) note = "特指";

        return {
          ...playerStatistic,
          ageLabel: playerStatistic.player.dob
            ? getAgeLabel(
                new Date(playerStatistic.player.dob),
                new Date(date[0]),
                new Date(date[1]),
              )
            : undefined,
          note,
        };
      });

      setPlayerStatistics(sortByPosition(players, "mainPosition"));
    }
    setAppearancePlotIsLoading(false);
  };

  const quickFilterDatas: QuickFilterData[] = useMemo(() => {
    const competitionFilter: QuickFilterData = {
      name: "competitions",
      multi: true,
      selectedKeys: selectedCompetitions,
      items: competitions.map((competition) => {
        return {
          key: competition._id,
          label: competition.name,
          onClick: async () => {
            let competitionIds: string[] = selectedCompetitions;

            if (selectedCompetitions.includes(competition._id)) {
              competitionIds = selectedCompetitions.filter(
                (p) => p !== competition._id,
              );
            } else {
              competitionIds = [...selectedCompetitions, competition._id];
            }
            setSelectedCompetitions(competitionIds);

            const filtered =
              competitionIds.length === 0
                ? matches
                : matches.filter((match) =>
                    competitionIds.some(
                      (competitionId) => match.competition.id === competitionId,
                    ),
                  );

            await handleClickCompetition({
              matchIds: filtered.map((f) => f._id),
            });
            setFilteredMatches(filtered);
          },
        };
      }),
    };

    const formationFilter: QuickFilterData = {
      name: "formations",
      selectedKeys: selectedFormation ? [selectedFormation] : undefined,
      items: formationCounts.map((formationCount) => {
        return {
          key: formationCount.key,
          label: `${formationCount.name}  (${formationCount.count})`,
          onClick: () => {
            setSelectedFormation(formationCount.key);
          },
        };
      }),
    };

    return [competitionFilter, formationFilter];
  }, [competitions, selectedCompetitions, formationCounts, selectedFormation]);

  const { groupedPlayers, defaultOpenPositions, topHeaderText } =
    useMemo(() => {
      const positionByFormation = formationCounts.find(
        (f) => f.key === selectedFormation,
      )?.position_formation;

      const positions =
        positionByFormation || displayPositions.map((d) => d.key);

      const positionOptions = getGroupedPositions(positions);

      const groupedPlayers = createGroupedPlayers(
        playerStatistics,
        positionOptions,
      );

      const topHeaderText =
        date && date.length === 2
          ? `${date[0].replace(">=", "")} → ${date[1].replace("<=", "")}`
          : "";

      return {
        groupedPlayers: groupedPlayers,
        defaultOpenPositions: new Set([...positions]),
        topHeaderText,
      };
    }, [
      playerStatistics,
      formationCounts,
      selectedFormation,
      displayPositions,
      date,
    ]);

  return {
    readAppearancePlot,
    topHeaderText,
    playerRegistrations,
    matches: filteredMatches,
    playerAppearance,
    defaultOpenPositions,
    groupedPlayers,
    quickFilterDatas,

    playerStatistics,
    appearancePlotIsLoading,
  };
};
