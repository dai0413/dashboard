import { useEffect, useState } from "react";
import { useTeam } from "../../../../../context/models/team";
import {
  useMatchPanel,
  usePlayerPanel,
  useSeriesPanel,
  usePlayerPlotPanel,
  useFormationPlotPanel,
} from "./index";
import {
  NATIONAL_TEAM_TAB,
  NationalTeamTab,
  UseNationalTeamSummary,
} from "../types";

export const useNationalTeamSummary = (id: string): UseNationalTeamSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useTeam();

  const [selectedTab, setSelectedTab] = useState<NationalTeamTab>(
    NATIONAL_TEAM_TAB.SERIES,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as NationalTeamTab);
  };

  const { matches, readMatches } = useMatchPanel();
  const seriesPanel = useSeriesPanel();
  const { players, readPlayers } = usePlayerPanel();
  const {
    nationalCallUp,
    nationalMatchSeries,
    playerAppearance,
    playerStatistics,
    readPlayerPlot,
    playerPlotIsLoading,
    formationCounts,
    quickFilterDatas,
    groupedPlayers,
    defaultOpenPositions,
    topHeaderText,
  } = usePlayerPlotPanel();
  const formationPlotPanel = useFormationPlotPanel();

  useEffect(() => {
    (async () => {
      if (id) {
        await Promise.all([
          readItem(id),
          readMatches(id),
          seriesPanel.readItems(id),
          readPlayers(id),
          readPlayerPlot(id),
          formationPlotPanel.readFormationPlot(id),
        ]);
      }
    })();
  }, [id]);

  return {
    id,

    selected,
    isLoading,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      player: {
        text: `${selected?.normalized_name || selected?.abbr}に招集された選手`,
        isLoading: players.isLoading,
        key: `${selectedTab}`,
        items: players.data,
        reloadFun: async () => readPlayers(id),
      },

      match: {
        text: `${selected?.normalized_name || selected?.abbr}の試合`,
        isLoading: matches.isLoading,
        key: `${selectedTab}`,
        items: matches.data,
        reloadFun: async () => readMatches(id),
      },

      series: {
        text: `${selected?.normalized_name || selected?.abbr}の試合シリーズ`,
        isLoading: seriesPanel.isLoading,
        key: `${selectedTab}`,
        items: seriesPanel.items,
        reloadFun: async () => seriesPanel.readItems(id),
      },

      playerPlot: {
        key: `${selectedTab}`,
        text: `${selected?.normalized_name || selected?.abbr}に招集された選手`,
        isLoading: playerPlotIsLoading,
        items: {
          playerStatistics,
          nationalCallUp,
          nationalMatchSeries,
          playerAppearance,
          formationCounts,
          quickFilterDatas,
          groupedPlayers,
          defaultOpenPositions,
          topHeaderText,
        },
        reloadFun: async (filterConditions, sortConditions) =>
          readPlayerPlot(id, filterConditions, sortConditions),
      },

      formationPlot: {
        key: `${selectedTab}`,
        text: `${selected?.normalized_name || selected?.abbr}に招集された選手`,
        isLoading: formationPlotPanel.formationPlotIsLoading,
        items: formationPlotPanel.items,
        reloadFun: async (filterConditions, sortConditions) =>
          formationPlotPanel.reloadFun(filterConditions, sortConditions, id),
      },
    },
  };
};
