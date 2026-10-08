import { useMemo, useState, useCallback } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { api } from "../../../../../context/api-context";
import { ModelType } from "../../../../../types/models";
import { createItemBase, readItemsBase } from "../../../../../lib/api";
import { NationalCallup } from "../../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../../types/models/national-match-series";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../../../types/models/player-appearance";
import { convert } from "../../../../../lib/convert/DBtoGetted";
import { normalizeFiltersForApi } from "../../../../../utils/filter/normalizeFiltersForApi";
import { FormationCounts } from "../../ClubTeam/types";
import { getFormationCounts } from "../../../../../utils/data";
import {
  Competition,
  CompetitionGet,
} from "../../../../../types/models/competition";
import { QuickFilterData } from "../../../../../types/table";
import { quickFilterItems as dateQuickFilterItems } from "../constants/quickFilterItems";

type SeriesWithCompetition = NationalMatchSeries & {
  competitionIds: string[];
};

export const usePlayerPlotPanel = () => {
  const [nationalCallUp, setNationalCallUp] = useState<NationalCallup[]>([]);
  const [nationalMatchSeries, setNationalMatchSeries] = useState<
    SeriesWithCompetition[]
  >([]);
  const [playerAppearance, setPlayerAppearance] = useState<
    PlayerAppearanceGet[]
  >([]);
  const [playerPlotIsLoading, setPlayerPlotIsLoading] =
    useState<boolean>(false);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistic[]>(
    [],
  );
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionGet[]>([]);
  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(
    [],
  );

  const [filteredNationalMatchSeries, setfilteredNationalMatchSeries] =
    useState<NationalMatchSeries[]>([]);

  type ResetParams = {
    nationalCallUp?: boolean;
    nationalMatchSeries?: boolean;
    playerAppearance?: boolean;
    playerStatistics?: boolean;
    formationCounts?: boolean;
    competitions?: boolean;
    selectedCompetitions?: boolean;
    filteredNationalMatchSeries?: boolean;
  };

  const handleReset = ({
    nationalCallUp,
    nationalMatchSeries,
    playerAppearance,
    playerStatistics,
    formationCounts,
    competitions,
    selectedCompetitions,
    filteredNationalMatchSeries,
  }: ResetParams) => {
    setPlayerPlotIsLoading(false);
    nationalCallUp && setNationalCallUp([]);
    nationalMatchSeries && setNationalMatchSeries([]);
    playerAppearance && setPlayerAppearance([]);
    playerStatistics && setPlayerStatistics([]);
    formationCounts && setFormationCounts([]);
    competitions && setCompetitions([]);
    selectedCompetitions && setSelectedCompetitions([]);
    filteredNationalMatchSeries && setfilteredNationalMatchSeries([]);
  };

  const readPlayerPlot = useCallback(
    async (
      teamId: string,
      filterConditions?: FilterableFieldDefinition[],
      sortConditions?: SortableFieldDefinition[],
    ) => {
      setPlayerPlotIsLoading(true);
      const readParams: Record<string, any> = {
        getAll: true,
        team: teamId,
      };

      const joined_atObj = filterConditions?.find((f) => f.key === "joined_at");
      const left_atObj = filterConditions?.find((f) => f.key === "left_at");

      if (!joined_atObj || !left_atObj)
        return handleReset({
          nationalCallUp: true,
          nationalMatchSeries: true,
          playerAppearance: true,
          playerStatistics: true,
          formationCounts: true,
          competitions: true,
          selectedCompetitions: true,
          filteredNationalMatchSeries: true,
        });

      if (filterConditions && filterConditions.length > 0) {
        readParams.filters = JSON.stringify(
          normalizeFiltersForApi(filterConditions),
        );
      }

      if (sortConditions && sortConditions.length > 0) {
        readParams.sorts = JSON.stringify(sortConditions);
      }

      const obj = await readItemsBase<NationalMatchSeries[]>({
        apiInstance: api,
        backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
        params: readParams,
      });

      const seriesIds = obj?.data.map((d) => d._id);

      if (
        !obj?.data ||
        obj?.data.length === 0 ||
        !seriesIds ||
        seriesIds.length === 0
      ) {
        return handleReset({
          nationalCallUp: true,
          playerAppearance: true,
          playerStatistics: true,
          formationCounts: true,
          competitions: true,
          selectedCompetitions: true,
          filteredNationalMatchSeries: true,
        });
      }

      const seiresWithCompetition: SeriesWithCompetition[] = obj.data.map(
        (d) => {
          return {
            ...d,
            competitionIds: [
              ...new Set(
                d.matches.map((d) => d.competition._id ?? d.competition),
              ),
            ],
          };
        },
      );

      setNationalMatchSeries(seiresWithCompetition);
      setfilteredNationalMatchSeries(seiresWithCompetition);

      const nationalCallupRes = await readItemsBase<NationalCallup[]>({
        apiInstance: api,
        backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
        params: {
          getAll: true,
          series: seriesIds,
        },
      });

      if (nationalCallupRes?.data) setNationalCallUp(nationalCallupRes.data);

      const matches = [
        ...new Set(obj?.data.flatMap((d) => d.matches.map((m) => m)) ?? []),
      ];

      const matchIds: string[] = matches.map((m) => m._id);

      if (matches.length === 0) {
        handleReset({
          formationCounts: true,
          competitions: true,
          selectedCompetitions: true,
        });
      } else {
        const formationCounts = await getFormationCounts(teamId, matchIds);

        if (formationCounts) {
          setFormationCounts(formationCounts);
        } else {
          handleReset({
            formationCounts: true,
            competitions: true,
            selectedCompetitions: true,
          });
        }

        const competitionsIds = [
          ...new Set(
            matches.map((m) => m.competition._id ?? m.competition) ?? [],
          ),
        ] as string[];

        const competitionRes = await readItemsBase<Competition[]>({
          apiInstance: api,
          params: { _id: competitionsIds, getAll: true },
          backendRoute: API_PATHS.COMPETITION.ROOT,
        });

        if (competitionRes?.data) {
          const competitions = convert(
            ModelType.COMPETITION,
            competitionRes.data,
          );

          setCompetitions(competitions);
          setSelectedCompetitions(competitions.map((c) => c._id));
        }
      }

      const playerIds: string[] = [
        ...new Set((nationalCallupRes?.data ?? []).map((d) => d.player._id)),
      ];

      const playerStatistic = await createItemBase<PlayerStatistic[]>({
        apiInstance: api,
        backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
        data: {
          player: playerIds,
          match: matchIds,
          team: teamId,
        },
      });

      if (playerStatistic?.success) {
        setPlayerStatistics(playerStatistic.data);
      } else {
        setPlayerStatistics([]);
      }

      const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
        apiInstance: api,
        backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
        params: { getAll: true, match: matchIds, team: teamId },
      });

      if (playerAppearanceRes?.data) {
        const newPlayerAppearance = convert(
          ModelType.PLAYER_APPEARANCE,
          playerAppearanceRes.data,
        );
        setPlayerAppearance(newPlayerAppearance);
      } else {
        setPlayerAppearance([]);
      }

      setPlayerPlotIsLoading(false);
    },
    [],
  );

  type HandleClickCompetition = {
    teamId: string;
    matchIds: string[];
    seriesIds: string[];
  };
  const handleClickCompetition = async ({
    teamId,
    matchIds,
    seriesIds,
  }: HandleClickCompetition) => {
    setPlayerPlotIsLoading(true);

    const formationCounts = await getFormationCounts(teamId, matchIds);

    if (formationCounts) {
      setFormationCounts(formationCounts);
    } else {
      setFormationCounts([]);
    }

    const nationalCallupRes = await readItemsBase<NationalCallup[]>({
      apiInstance: api,
      backendRoute: API_PATHS.NATIONAL_CALLUP.ROOT,
      params: {
        getAll: true,
        series: seriesIds,
      },
    });

    if (nationalCallupRes?.data) setNationalCallUp(nationalCallupRes.data);

    const playerIds: string[] = [
      ...new Set((nationalCallupRes?.data ?? []).map((d) => d.player._id)),
    ];

    const playerStatistic = await createItemBase<PlayerStatistic[]>({
      apiInstance: api,
      backendRoute: API_PATHS.AGGREGATE.PLAYER.STATISTICS,
      data: {
        player: playerIds,
        match: matchIds,
        team: teamId,
      },
    });

    if (playerStatistic?.success) {
      setPlayerStatistics(playerStatistic.data);
    } else {
      setPlayerStatistics([]);
    }

    const playerAppearanceRes = await readItemsBase<PlayerAppearance[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
      params: { getAll: true, match: matchIds, team: teamId },
    });

    if (playerAppearanceRes?.data) {
      const newPlayerAppearance = convert(
        ModelType.PLAYER_APPEARANCE,
        playerAppearanceRes.data,
      );
      setPlayerAppearance(newPlayerAppearance);
    } else {
      setPlayerAppearance([]);
    }

    setPlayerPlotIsLoading(false);
  };

  const quickFilterDatas: QuickFilterData[] = useMemo(() => {
    const competitionFilter = {
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
                ? nationalMatchSeries
                : nationalMatchSeries.filter((series) =>
                    competitionIds.some((competitionId) =>
                      series.competitionIds.includes(competitionId),
                    ),
                  );

            const teamIds = [...new Set(filtered.map((f) => f.team._id))];
            if (teamIds.length !== 1) return;

            await handleClickCompetition({
              teamId: teamIds[0],
              matchIds: filtered.flatMap((f) =>
                f.matches.map((match) => match._id),
              ),
              seriesIds: filtered.map((f) => f._id),
            });
            setfilteredNationalMatchSeries(filtered);
          },
        };
      }),
    };

    return [dateQuickFilterItems, competitionFilter];
  }, [competitions, selectedCompetitions]);

  return {
    nationalCallUp,
    nationalMatchSeries: filteredNationalMatchSeries,
    playerAppearance,
    playerStatistics,
    playerPlotIsLoading,
    formationCounts,
    quickFilterDatas,
    readPlayerPlot,
  };
};
