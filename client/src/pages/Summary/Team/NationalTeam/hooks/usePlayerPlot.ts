import { useMemo, useState, useCallback } from "react";
import {
  API_PATHS,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
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
import { getGroupedPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/MatchMatrix/utils";
import { displayPositions } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/context/displayPositions";
import {
  createGroupedPlayers,
  getAgeLabel,
} from "../../../../../components/dataView/DataViewContent/DataView/Matrix/utils";
import { MatrixPlayer } from "../../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import { PlayerPlot } from "../types";
import { fullNationalPeriods } from "../../../../../constants/period";

type SeriesWithCompetition = NationalMatchSeries & {
  competitionIds: string[];
};

const defaultDate = fullNationalPeriods.sort(
  (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
)[0];
const defaultFilterCondition: FilterableFieldDefinition[] =
  dateQuickFilterItems.items.find((period) => period.key === defaultDate.key)
    ?.filterCondition || [];

export const usePlayerPlotPanel = () => {
  const [nationalCallUp, setNationalCallUp] = useState<NationalCallup[]>([]);
  const [nationalMatchSeries, setNationalMatchSeries] = useState<
    SeriesWithCompetition[]
  >([]);
  const [playerAppearance, setPlayerAppearance] = useState<
    PlayerAppearanceGet[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playerStatistics, setPlayerStatistics] = useState<MatrixPlayer[]>([]);
  const [formationCounts, setFormationCounts] = useState<FormationCounts[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionGet[]>([]);

  const [startBaseDate, setStartBaseDate] = useState<Date | undefined>(
    undefined,
  );
  const [endBaseDate, setEndBaseDate] = useState<Date | undefined>(undefined);
  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(
    [],
  );
  const [selectedFormation, setSelectedFormation] = useState<string | "BASE">(
    "BASE",
  );

  const [filteredNationalMatchSeries, setfilteredNationalMatchSeries] =
    useState<NationalMatchSeries[]>([]);

  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    defaultDate.key,
  );

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
    setIsLoading(false);
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
    ): Promise<PlayerPlot | null> => {
      setIsLoading(true);

      const filters =
        filterConditions && filterConditions.length > 0
          ? filterConditions
          : defaultFilterCondition;

      const getDateFilterValue = (key: string): Date | null => {
        const value = filters.find((condition) => condition.key === key)
          ?.value?.[0];

        if (value === undefined || typeof value === "boolean") {
          return null;
        }

        return new Date(value);
      };

      const startBaseDate =
        getDateFilterValue("joined_at") ?? new Date(defaultDate.startDate);

      const endBaseDate =
        getDateFilterValue("left_at") ?? new Date(defaultDate.endDate);

      setStartBaseDate(startBaseDate);
      setEndBaseDate(endBaseDate);

      const readParams: Record<string, any> = {
        getAll: true,
        team: teamId,
        filters: JSON.stringify(normalizeFiltersForApi(filters)),
      };

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
        const newItems: PlayerPlot = {
          isLoading: false,
          competitions: [],
          selectedCompetitions: [],
          formationCounts: [],
          selectedFormation: "",
          playerStatistics: [],
          playerAppearance: [],
          nationalCallUp: [],
          startBaseDate,
          endBaseDate,
        };

        handleReset({
          nationalCallUp: true,
          playerAppearance: true,
          playerStatistics: true,
          formationCounts: true,
          competitions: true,
          selectedCompetitions: true,
          filteredNationalMatchSeries: true,
        });

        return newItems;
      }

      let newItems: PlayerPlot = {
        isLoading: false,
        competitions: [],
        selectedCompetitions: [],
        formationCounts: [],
        selectedFormation: "",
        playerStatistics: [],
        playerAppearance: [],
        nationalCallUp: [],
        startBaseDate,
        endBaseDate,
      };

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

      if (nationalCallupRes?.data) {
        setNationalCallUp(nationalCallupRes.data);
        newItems["nationalCallUp"] = nationalCallupRes.data;
      }

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
        const value = await getFormationCounts(teamId, matchIds);

        if (value) {
          setFormationCounts(value.formationCounts);
          newItems["formationCounts"] = value.formationCounts;
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

          newItems["competitions"] = competitions;
          newItems["selectedCompetitions"] = competitions.map((c) => c._id);
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
        const players = playerStatistic.data.map((playerStatistic) => {
          return {
            ...playerStatistic,
            ageLabel: playerStatistic.player.dob
              ? getAgeLabel(
                  new Date(playerStatistic.player.dob),
                  startBaseDate,
                  endBaseDate,
                )
              : undefined,
          };
        });

        setPlayerStatistics(players);
        newItems["playerStatistics"] = players;
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
        newItems["playerAppearance"] = newPlayerAppearance;
      } else {
        setPlayerAppearance([]);
      }

      setIsLoading(false);
      return newItems;
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
    setIsLoading(true);

    const value = await getFormationCounts(teamId, matchIds);

    if (value) {
      setFormationCounts(value.formationCounts);
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
      const players = playerStatistic.data.map((playerStatistic) => {
        return {
          ...playerStatistic,
          ageLabel: playerStatistic.player.dob
            ? getAgeLabel(
                new Date(playerStatistic.player.dob),
                startBaseDate,
                endBaseDate,
              )
            : undefined,
        };
      });

      setPlayerStatistics(players);
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

    setIsLoading(false);
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

    const formationFIlterItems = formationCounts.map((formationCount) => {
      return {
        key: formationCount.key,
        label: `${formationCount.name}  (${formationCount.count})`,
        onClick: () => {
          setSelectedFormation(formationCount.key);
        },
      };
    });

    const formationFilter: QuickFilterData = {
      name: "formations",
      selectedKeys: [selectedFormation],
      items: [
        {
          key: "BASE",
          label: "BASE",
          onClick: () => {
            setSelectedFormation("BASE");
          },
        },
        ...formationFIlterItems,
      ],
    };

    const converted: QuickFilterData = {
      ...dateQuickFilterItems,
      selectedKeys: [selectedDateKey],
      items: dateQuickFilterItems.items.map((item) => {
        return {
          ...item,
          onClick: () => {
            setSelectedDateKey(item.key);
          },
        };
      }),
    };

    return [converted, competitionFilter, formationFilter];
  }, [
    selectedDateKey,
    competitions,
    selectedCompetitions,
    formationCounts,
    selectedFormation,
  ]);

  const { groupedPlayers, defaultOpenPositions, topHeaderText } =
    useMemo(() => {
      const positionByFormation = formationCounts.find(
        (f) => f.key === selectedFormation,
      )?.position_formation;

      const positions =
        positionByFormation || displayPositions.map((d) => d.key);

      const groupedPositions = getGroupedPositions(positions);

      const groupedPlayers = createGroupedPlayers({
        playerStatistics,
        groupedPositions,
      });

      return {
        groupedPlayers: groupedPlayers,
        defaultOpenPositions: new Set([...positions]),
        topHeaderText: `${startBaseDate?.toLocaleDateString()} → ${endBaseDate?.toLocaleDateString()}`,
      };
    }, [
      playerStatistics,
      formationCounts,
      selectedFormation,
      displayPositions,
      startBaseDate,
      endBaseDate,
    ]);

  const restore = ({
    isLoading,
    competitions,
    selectedCompetitions,
    formationCounts,
    selectedFormation,
    playerStatistics,
    startBaseDate,
    endBaseDate,
  }: PlayerPlot) => {
    setIsLoading(isLoading);
    setCompetitions(competitions);
    setSelectedCompetitions(selectedCompetitions);
    setFormationCounts(formationCounts);
    setSelectedFormation(selectedFormation);
    setPlayerStatistics(playerStatistics);
    setStartBaseDate(startBaseDate);
    setEndBaseDate(endBaseDate);
  };

  return {
    readPlayerPlot,
    restore,
    isLoading,
    items: {
      nationalCallUp,
      nationalMatchSeries: filteredNationalMatchSeries,
      playerAppearance,
      playerStatistics,
      formationCounts,
      quickFilterDatas,
      groupedPlayers,
      defaultOpenPositions,
      topHeaderText,
    },
  };
};
