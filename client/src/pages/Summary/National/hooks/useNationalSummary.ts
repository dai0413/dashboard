import { useCallback, useEffect, useMemo, useState } from "react";
import { useCompetitionPanel, useSeriesPanel, useTeamPanel } from "./index";
import { NATIONAL_TAB, NationalTab, UseNationalSummary } from "../types";
import { useCountry } from "../../../../context/models/country";

export const useNationalSummary = (id: string): UseNationalSummary => {
  const {
    metacrud: { selected, readItem, isLoading },
  } = useCountry();

  const [selectedTab, setSelectedTab] = useState<NationalTab>(
    NATIONAL_TAB.COMPETITION,
  );

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as NationalTab);
  };

  const { teams, readTeams } = useTeamPanel();
  const { competitions, readCompetitions } = useCompetitionPanel();
  const seriesPanel = useSeriesPanel();

  const teamIds: string[] = useMemo(() => {
    return teams.data.map((d) => d._id);
  }, [teams]);

  const readDatas = useCallback(
    async (countryId: string) => {
      await Promise.all([readTeams(countryId), readCompetitions(countryId)]);

      await seriesPanel.readItems(teamIds);
    },
    [teamIds, readTeams, readCompetitions, seriesPanel],
  );

  // id変更で読み込む
  const onChangeId = async (competitionId: string) => {
    readDatas(competitionId);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (id) {
        await onChangeId(id);
      }
    })();
  }, [selected]);

  return {
    id,
    isLoading,
    selected,

    tab: {
      selectedTab,
      handleSelect: handleSelectedTab,
    },

    panels: {
      competition: {
        key: `${selectedTab}`,
        isLoading: competitions.isLoading,
        items: competitions.data,
        reloadFun: async () => readCompetitions(id),
      },

      team: {
        key: `${selectedTab}`,
        isLoading: teams.isLoading,
        items: teams.data,
        reloadFun: async () => readTeams(id),
      },

      nationalMatchSeries: {
        key: `${selectedTab}`,
        isLoading: seriesPanel.isLoading,
        items: seriesPanel.items,
        reloadFun: async () => seriesPanel.readItems(teamIds),
      },
    },
  };
};
