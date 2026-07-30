import { useEffect, useState } from "react";
import { useTeam } from "../../../../../context/models/team";
import {
  useMatchPanel,
  usePlayerPanel,
  useSeriesPanel,
  usePlayerPlotPanel,
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
  const { series, readSeries } = useSeriesPanel();
  const { players, readPlayers } = usePlayerPanel();
  const {
    nationalCallUp,
    nationalMatchSeries,
    playerAppearance,
    readPlayerPlot,
  } = usePlayerPlotPanel();

  useEffect(() => {
    (async () => {
      if (id) {
        await Promise.all([
          readItem(id),
          readMatches(id),
          readSeries(id),
          readPlayers(id),
          readPlayerPlot(id),
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
        key: `${selectedTab}`,
        items: players.data,
        reloadFun: async () => readPlayers(id),
      },

      match: {
        text: `${selected?.normalized_name || selected?.abbr}の試合`,
        key: `${selectedTab}`,
        items: matches.data,
        reloadFun: async () => readMatches(id),
      },

      series: {
        text: `${selected?.normalized_name || selected?.abbr}の試合シリーズ`,
        key: `${selectedTab}`,
        items: series.data,
        reloadFun: async () => readSeries(id),
      },

      playerPlot: {
        key: `${selectedTab}`,
        text: `${selected?.normalized_name || selected?.abbr}に招集された選手`,
        items: {
          nationalCallUp,
          nationalMatchSeries,
          playerAppearance,
        },
        reloadFun: async () => readPlayerPlot(id),
      },
    },
  };
};
